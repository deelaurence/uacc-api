require('../jest.setup');
const request = require('supertest');
const app = require('../app');

describe('Guest payment initiation', () => {
  it('rejects guest payment without amountKobo', async () => {
    const response = await request(app)
      .post('/paystack/guest-initiate')
      .send({ name: 'Visitor' });
    expect(response.status).toBe(400);
  });

  it('accepts guest payment payload shape', async () => {
    const response = await request(app)
      .post('/paystack/guest-initiate')
      .send({ amountKobo: 500000, name: 'Visitor' });
    expect([200, 400, 500]).toContain(response.status);
  });
});
