const parseAmountKobo = (value) => {
  const amountKobo = Number(value);
  if (!Number.isInteger(amountKobo) || amountKobo <= 0) {
    const error = new Error('amountKobo must be a positive integer');
    error.statusCode = 400;
    throw error;
  }
  return amountKobo;
};

module.exports = { parseAmountKobo };
