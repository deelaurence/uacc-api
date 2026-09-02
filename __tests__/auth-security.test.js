require('../jest.setup');
const request = require('supertest');
const app = require('../app');

describe('Auth security', () => {
  it('does not expose the legacy edit-password endpoint', async () => {
    const response = await request(app)
      .put('/auth/edit-password')
      .send({
        email: 'victim@example.com',
        password: 'hacked-password',
        seedPhrase: 'point-believe-twenty-open-rail-pool',
      });

    expect(response.status).toBe(404);
  });
});
