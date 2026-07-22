jest.mock('../utils/paystackClient', () => ({
  verifyTransaction: jest.fn(),
}));

jest.mock('../models/Payment', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

const { verifyTransaction } = require('../utils/paystackClient');
const Payment = require('../models/Payment');
const {
  mapVerifiedTransaction,
  toPublicReceipt,
  verifyAndSyncPayment,
  verifyAndSyncWithStatus,
} = require('../services/paymentVerification');

describe('paymentVerification service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Payment.findOne.mockResolvedValue(null);
    Payment.create.mockImplementation((payload) => Promise.resolve({
      ...payload,
      _id: 'mongo-id',
    }));
  });

  it('maps a successful Paystack verification payload', () => {
    const mapped = mapVerifiedTransaction({
      reference: 'ref_123',
      amount: 500000,
      status: 'success',
      paid_at: '2026-07-10T10:00:00.000Z',
      metadata: {
        name: 'Jane Doe',
        description: 'Offering',
        userId: 'guest:abc',
      },
      customer: {
        email: 'guest@mtofmercy.org',
      },
      authorization: {
        authorization_code: 'AUTH_secret',
      },
    });

    expect(mapped.recordStatus).toBe('Success');
    expect(mapped.amountKobo).toBe(500000);
    expect(mapped.name).toBe('Jane Doe');
  });

  it('stores intended net amount when user foots charges', () => {
    const mapped = mapVerifiedTransaction({
      reference: 'ref_123',
      amount: 517766,
      status: 'success',
      metadata: {
        name: 'Jane Doe',
        description: 'Offering',
        userId: 'guest:abc',
        intendedNetKobo: '500000',
        processingFeeKobo: '17766',
        userFootsCharges: 'true',
      },
      customer: { email: 'guest@mtofmercy.org' },
    });

    expect(mapped.amountKobo).toBe(500000);
    expect(mapped.chargeKobo).toBe(517766);
    expect(mapped.feeKobo).toBe(17766);
    expect(mapped.userFootsCharges).toBe(true);
  });

  it('only syncs payment records after Paystack verification succeeds', async () => {
    verifyTransaction.mockResolvedValue({
      reference: 'ref_success',
      amount: 100000,
      status: 'success',
      paid_at: '2026-07-10T10:00:00.000Z',
      metadata: {
        name: 'Guest',
        description: 'Offering',
        userId: 'guest:xyz',
      },
      customer: { email: 'guest@mtofmercy.org' },
    });

    const { payment, mapped } = await verifyAndSyncPayment('ref_success', { requireSuccess: true });

    expect(verifyTransaction).toHaveBeenCalledWith('ref_success');
    expect(Payment.create).toHaveBeenCalled();
    expect(payment.reference).toBe('ref_success');
    expect(toPublicReceipt(payment, mapped).verified).toBe(true);
    expect(toPublicReceipt(payment, mapped)).not.toHaveProperty('paystackAuthorization');
  });

  it('rejects receipt data when Paystack verification is not successful', async () => {
    verifyTransaction.mockResolvedValue({
      reference: 'ref_failed',
      amount: 100000,
      status: 'failed',
      metadata: { name: 'Guest', description: 'Offering' },
      customer: { email: 'guest@mtofmercy.org' },
    });

    await expect(
      verifyAndSyncPayment('ref_failed', { requireSuccess: true })
    ).rejects.toMatchObject({ statusCode: 404 });

    expect(Payment.create).not.toHaveBeenCalled();
  });

  it('verifies with Paystack before marking failed payments', async () => {
    verifyTransaction.mockResolvedValue({
      reference: 'ref_failed',
      amount: 100000,
      status: 'failed',
      metadata: { name: 'Guest', description: 'Offering', userId: 'guest:xyz' },
      customer: { email: 'guest@mtofmercy.org' },
    });

    const { payment } = await verifyAndSyncWithStatus('ref_failed', 'Failed');

    expect(verifyTransaction).toHaveBeenCalledWith('ref_failed');
    expect(payment.status).toBe('Failed');
  });
});
