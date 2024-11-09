import { describe, expect, it } from 'vitest';
import { calculateDiscount } from '../src/main';

describe('calculateDiscount', () => {
  it('should return discounted price if given valid code', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9);
    expect(calculateDiscount(10, 'SAVE20')).toBe(8);
  });

  it('should handle negative price', () => {
    expect(calculateDiscount(-10, 'SAVE10')).toMatch(/invalid/i);
  });

  it('should handle when the discount code is invalid', () => {
    expect(calculateDiscount(10, 'INVALID')).toBe(10);
  });
});
