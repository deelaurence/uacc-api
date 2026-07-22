const { isUserFootingCharges } = require('../config/env');

const FLAT_FEE_KOBO = 10000;
const FLAT_FEE_WAIVER_THRESHOLD_KOBO = 250000;
const MAX_FEE_KOBO = 200000;
const FEE_NUMERATOR = 15;
const FEE_DENOMINATOR = 1000;

/**
 * Paystack Nigeria local channel fee estimate (integer kobo only).
 * Under NGN 2,500: 1.5% only. At/above NGN 2,500: 1.5% + NGN 100. Cap: NGN 2,000.
 * International cards may differ; this is the displayed local estimate.
 */
const calculatePaystackFeeKobo = (chargeKobo) => {
  if (!Number.isInteger(chargeKobo) || chargeKobo <= 0) {
    return 0;
  }

  const percentFee = Math.floor((chargeKobo * FEE_NUMERATOR) / FEE_DENOMINATOR);
  const flatFee = chargeKobo >= FLAT_FEE_WAIVER_THRESHOLD_KOBO ? FLAT_FEE_KOBO : 0;
  return Math.min(percentFee + flatFee, MAX_FEE_KOBO);
};

const netFromChargeKobo = (chargeKobo) => chargeKobo - calculatePaystackFeeKobo(chargeKobo);

const grossUpChargeKobo = (netKobo) => {
  if (!Number.isInteger(netKobo) || netKobo <= 0) {
    return 0;
  }

  let chargeKobo = netKobo;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const received = netFromChargeKobo(chargeKobo);

    if (received >= netKobo) {
      return chargeKobo;
    }

    chargeKobo += netKobo - received;
  }

  return chargeKobo;
};

const buildPaymentAmounts = (netKobo) => {
  const userFootsCharges = isUserFootingCharges();

  if (!userFootsCharges) {
    return {
      netKobo,
      feeKobo: calculatePaystackFeeKobo(netKobo),
      chargeKobo: netKobo,
      userFootsCharges: false,
    };
  }

  const chargeKobo = grossUpChargeKobo(netKobo);

  return {
    netKobo,
    feeKobo: chargeKobo - netKobo,
    chargeKobo,
    userFootsCharges: true,
  };
};

module.exports = {
  calculatePaystackFeeKobo,
  grossUpChargeKobo,
  buildPaymentAmounts,
  netFromChargeKobo,
  FLAT_FEE_KOBO,
  FLAT_FEE_WAIVER_THRESHOLD_KOBO,
  MAX_FEE_KOBO,
};
