const publicOnly = require('../middleware/public-only');

describe('publicOnly middleware', () => {
  it('marks requests as public client reads', (done) => {
    const req = {};
    publicOnly(req, {}, () => {
      expect(req.publicOnly).toBe(true);
      done();
    });
  });
});
