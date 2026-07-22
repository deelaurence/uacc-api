require('../jest.setup');
const request = require('supertest');
const app = require('../app');

describe('Admin route protection', () => {
  it('returns 401 for admin payments without token', async () => {
    const response = await request(app).get('/admin/payments');
    expect(response.status).toBe(401);
  });

  it('returns 401 for admin publish without token', async () => {
    const response = await request(app).put('/admin/publish/507f1f77bcf86cd799439011');
    expect(response.status).toBe(401);
  });

  it('returns 401 for author create without token', async () => {
    const response = await request(app)
      .post('/author')
      .send({ name: 'Test Author', description: 'Bio' });
    expect(response.status).toBe(401);
  });

  it('disables admin registration in production', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const response = await request(app)
      .post('/admin/auth/register')
      .send({ username: 'hack', password: 'password', name: 'Hacker' });
    expect(response.status).toBe(403);
    process.env.NODE_ENV = originalEnv;
  });
});
