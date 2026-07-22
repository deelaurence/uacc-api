require('dotenv').config();

const required = [
  'CLOUD_URI',
  'JWT_SECRET',
  'SESSION_SECRET',
  'CLIENT_URL',
  'SERVER_URL',
  'paystack_key',
];

const optional = [
  'PORT',
  'LOCAL_URI',
  'GOOGLE_ID',
  'GOOGLE_SECRET',
  'cloud_name',
  'api_key',
  'api_secret',
  'brevo_secret',
  'MAIL_EMAIL',
  'MAIL_PASSWORD',
  'NODE_ENV',
  'SENTRY_DSN',
  'USER_FOOTS_CHARGES',
  'GUEST_PAYMENT_EMAIL',
  'GUEST_EMAIL_DOMAIN',
];

const isUserFootingCharges = () => {
  const value = process.env.USER_FOOTS_CHARGES;
  if (value === undefined || value === null || value === '') {
    return false;
  }
  return String(value).toLowerCase() === 'true';
};

const FEE_REASON = 'Processing fee so the church receives your full offering.';

const validateEnv = () => {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

module.exports = { validateEnv, required, optional, isUserFootingCharges, FEE_REASON };
