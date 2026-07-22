const { v4: uuidv4 } = require('uuid');
const { verifyTransaction } = require('../utils/paystackClient');
const { formatDate } = require('../utils/dateFormat');
const Payment = require('../models/Payment');
const { NotFound } = require('../errors/customErrors');

const GUEST_OFFERING_DESCRIPTION = 'Offering';

const parseMetadataInt = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const parsed = Number.parseInt(String(value), 10);
  return Number.isInteger(parsed) ? parsed : null;
};

const parseMetadataBool = (value) => String(value).toLowerCase() === 'true';

const mapPaystackStatus = (paystackStatus) => {
  if (paystackStatus === 'success') {
    return 'Success';
  }
  if (paystackStatus === 'failed' || paystackStatus === 'abandoned') {
    return 'Failed';
  }
  return 'Pending';
};

const mapVerifiedTransaction = (verified) => {
  const metadata = verified.metadata || {};
  const customerName = [verified.customer?.first_name, verified.customer?.last_name]
    .filter(Boolean)
    .join(' ');

  const intendedNetKobo = parseMetadataInt(metadata.intendedNetKobo);
  const processingFeeKobo = parseMetadataInt(metadata.processingFeeKobo);
  const userFootsCharges = parseMetadataBool(metadata.userFootsCharges);
  const chargeKobo = verified.amount;
  const netKobo = intendedNetKobo ?? chargeKobo;
  const feeKobo = processingFeeKobo ?? (userFootsCharges ? chargeKobo - netKobo : null);

  return {
    reference: verified.reference,
    amountKobo: netKobo,
    chargeKobo,
    feeKobo,
    userFootsCharges,
    name: metadata.name || customerName || 'Guest',
    description: metadata.description || GUEST_OFFERING_DESCRIPTION,
    owner: metadata.userId || verified.customer?.email || 'unknown',
    recordStatus: mapPaystackStatus(verified.status),
    paystackStatus: verified.status,
    paidAt: verified.paid_at || verified.transaction_date || null,
    paystackAuthorization: verified.authorization?.authorization_code,
  };
};

const upsertVerifiedPayment = async (mapped) => {
  const existing = await Payment.findOne({ reference: mapped.reference });

  if (existing) {
    let changed = false;

    if (existing.status !== mapped.recordStatus) {
      existing.status = mapped.recordStatus;
      changed = true;
    }

    if (existing.amount !== mapped.amountKobo) {
      existing.amount = mapped.amountKobo;
      changed = true;
    }

    if (mapped.paystackAuthorization && !existing.paystackAuthorization) {
      existing.paystackAuthorization = mapped.paystackAuthorization;
      changed = true;
    }

    if (changed) {
      await existing.save();
    }

    return existing;
  }

  return Payment.create({
    owner: String(mapped.owner),
    id: uuidv4(),
    name: mapped.name,
    date: formatDate(),
    status: mapped.recordStatus,
    paystackAuthorization: mapped.paystackAuthorization,
    amount: mapped.amountKobo,
    description: mapped.description,
    reference: mapped.reference,
  });
};

const toPublicReceipt = (payment, mapped) => ({
  reference: payment.reference,
  name: payment.name,
  amount: payment.amount,
  description: payment.description,
  status: payment.status,
  paidAt: mapped.paidAt,
  verified: mapped.paystackStatus === 'success',
  userFootsCharges: mapped.userFootsCharges,
  ...(mapped.userFootsCharges ? {
    feeKobo: mapped.feeKobo,
    chargeKobo: mapped.chargeKobo,
  } : {}),
});

const verifyAndSyncPayment = async (reference, { requireSuccess = true } = {}) => {
  const verified = await verifyTransaction(reference);
  const mapped = mapVerifiedTransaction(verified);

  if (requireSuccess && verified.status !== 'success') {
    const error = new NotFound('Payment not verified with Paystack');
    error.statusCode = 404;
    throw error;
  }

  const payment = await upsertVerifiedPayment(mapped);
  return { payment, mapped, verified };
};

const verifyAndSyncWithStatus = async (reference, recordStatus) => {
  const verified = await verifyTransaction(reference);
  const mapped = mapVerifiedTransaction(verified);
  mapped.recordStatus = recordStatus;
  const payment = await upsertVerifiedPayment(mapped);
  return { payment, mapped, verified };
};

module.exports = {
  verifyAndSyncPayment,
  verifyAndSyncWithStatus,
  toPublicReceipt,
  mapVerifiedTransaction,
  upsertVerifiedPayment,
};
