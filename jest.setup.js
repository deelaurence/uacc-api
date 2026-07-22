process.env.NODE_ENV = 'test';
process.env.CLOUD_URI = 'mongodb://127.0.0.1:27017/mt-of-mercy-test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.SESSION_SECRET = 'test-session-secret';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.SERVER_URL = 'http://localhost:4000';
process.env.paystack_key = 'sk_test_dummy';
process.env.GOOGLE_ID = 'test-google-client-id';
process.env.GOOGLE_SECRET = 'test-google-client-secret';

jest.mock('./db/connect', () => jest.fn().mockResolvedValue());
