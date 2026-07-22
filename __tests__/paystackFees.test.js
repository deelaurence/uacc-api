const {
  calculatePaystackFeeKobo,
  grossUpChargeKobo,
  buildPaymentAmounts,
  netFromChargeKobo,
} = require('../utils/paystackFees');

describe('paystackFees', () => {
  const originalEnv = process.env.USER_FOOTS_CHARGES;

  afterEach(() => {
    process.env.USER_FOOTS_CHARGES = originalEnv;
  });

  describe('calculatePaystackFeeKobo', () => {
    it('charges 1.5% only under NGN 2,500', () => {
      expect(calculatePaystackFeeKobo(10000)).toBe(150);
      expect(calculatePaystackFeeKobo(100000)).toBe(1500);
      expect(calculatePaystackFeeKobo(249900)).toBe(3748);
    });

    it('charges 1.5% + NGN 100 at and above NGN 2,500', () => {
      expect(calculatePaystackFeeKobo(250000)).toBe(13750);
      expect(calculatePaystackFeeKobo(500000)).toBe(17500);
      expect(calculatePaystackFeeKobo(1000000)).toBe(25000);
      expect(calculatePaystackFeeKobo(10000000)).toBe(160000);
    });

    it('caps fees at NGN 2,000', () => {
      expect(calculatePaystackFeeKobo(20000000)).toBe(200000);
    });
  });

  describe('grossUpChargeKobo', () => {
    it('ensures church receives full net amount after fees', () => {
      const nets = [10000, 100000, 250000, 500000, 1000000, 10000000, 100000000];

      nets.forEach((netKobo) => {
        const chargeKobo = grossUpChargeKobo(netKobo);
        expect(netFromChargeKobo(chargeKobo)).toBeGreaterThanOrEqual(netKobo);
      });
    });

    it('grosses up NGN 5,000 so the church receives the full net', () => {
      const chargeKobo = grossUpChargeKobo(500000);
      expect(chargeKobo).toBe(517766);
      expect(netFromChargeKobo(chargeKobo)).toBeGreaterThanOrEqual(500000);
    });
  });

  describe('buildPaymentAmounts', () => {
    it('keeps charge equal to net when user does not foot charges', () => {
      process.env.USER_FOOTS_CHARGES = 'false';

      expect(buildPaymentAmounts(500000)).toEqual({
        netKobo: 500000,
        feeKobo: 17500,
        chargeKobo: 500000,
        userFootsCharges: false,
      });
    });

    it('adds fees on top when user foots charges', () => {
      process.env.USER_FOOTS_CHARGES = 'true';

      const amounts = buildPaymentAmounts(500000);

      expect(amounts).toEqual({
        netKobo: 500000,
        feeKobo: 17766,
        chargeKobo: 517766,
        userFootsCharges: true,
      });
    });
  });
});
