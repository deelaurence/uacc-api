const { parseAmountKobo } = require('../utils/money');

describe('parseAmountKobo', () => {
  it('accepts valid integer kobo values', () => {
    expect(parseAmountKobo(100)).toBe(100);
    expect(parseAmountKobo(105050)).toBe(105050);
  });

  it('rejects non-integer values', () => {
    expect(() => parseAmountKobo(10.5)).toThrow('amountKobo must be a positive integer');
  });

  it('rejects zero and negative values', () => {
    expect(() => parseAmountKobo(0)).toThrow();
    expect(() => parseAmountKobo(-100)).toThrow();
  });
});
