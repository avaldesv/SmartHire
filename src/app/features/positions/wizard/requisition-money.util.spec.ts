import { sanitizeNonNegativeMoneyInput } from './requisition-money.util';

describe('sanitizeNonNegativeMoneyInput', () => {
  it('strips letters and symbols so they never appear', () => {
    expect(sanitizeNonNegativeMoneyInput('abc')).toBe('');
    expect(sanitizeNonNegativeMoneyInput('-3')).toBe('3');
    expect(sanitizeNonNegativeMoneyInput('?2-')).toBe('2');
  });

  it('keeps digits and a single decimal separator (max 2 fractional digits)', () => {
    expect(sanitizeNonNegativeMoneyInput('12.345')).toBe('12.34');
    expect(sanitizeNonNegativeMoneyInput('12,5')).toBe('12.5');
    expect(sanitizeNonNegativeMoneyInput('12.')).toBe('12.');
  });
});
