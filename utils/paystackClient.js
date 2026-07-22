require('dotenv').config();

const paystack = require('paystack')(process.env.paystack_key);

const extractPaystackMessage = (response) => {
  if (!response) {
    return 'Empty response from Paystack';
  }
  if (typeof response.message === 'string') {
    return response.message;
  }
  if (response.response?.body?.message) {
    return response.response.body.message;
  }
  if (typeof response === 'string') {
    return response;
  }
  return 'Paystack initialization failed';
};

const initializeTransaction = async (payload) => {
  if (!process.env.paystack_key) {
    const error = new Error('Paystack secret key is not configured');
    error.statusCode = 500;
    throw error;
  }

  const response = await paystack.transaction.initialize({
    ...payload,
    callback_url: `${process.env.SERVER_URL}/paystack/callback`,
  });

  if (!response?.status || !response?.data?.authorization_url) {
    const message = extractPaystackMessage(response);
    console.error('[Paystack] initialize failed:', message, JSON.stringify(response));
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
  }

  return response;
};

const logPaymentError = (label, error) => {
  console.error(`[Paystack] ${label}:`, error?.message || error, error);
};

const verifyTransaction = async (reference) => {
  if (!reference || typeof reference !== 'string') {
    const error = new Error('Payment reference is required');
    error.statusCode = 400;
    throw error;
  }

  if (!process.env.paystack_key) {
    const error = new Error('Paystack secret key is not configured');
    error.statusCode = 500;
    throw error;
  }

  const response = await paystack.transaction.verify(reference);

  if (!response?.status || !response?.data) {
    const message = extractPaystackMessage(response);
    const error = new Error(message || 'Unable to verify payment with Paystack');
    error.statusCode = 400;
    throw error;
  }

  return response.data;
};

module.exports = {
  initializeTransaction,
  logPaymentError,
  verifyTransaction,
};
