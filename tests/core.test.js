import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';
import {
  calculateDiscount,
  canDrive,
  fetchData,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  Stack,
  validateUserInput,
} from '../src/core';

describe('getCoupons', () => {
  it('should get object with code and discount property', () => {
    let result = getCoupons();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return an array with valid coupon codes', () => {
    let coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('code');
      expect(typeof coupon.code).toBe('string');
      expect(coupon.code).toBeTruthy();
    });
  });

  it('should return an array with valid discount', () => {
    let coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('discount');
      expect(typeof coupon.discount).toBe('number');
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

describe('calculateDiscount', () => {
  it('should return discounted price if given valid code', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9);
    expect(calculateDiscount(10, 'SAVE20')).toBe(8);
  });

  it('should handle non-numeric price', () => {
    expect(calculateDiscount('10', 'SAVE10')).toMatch(/invalid/i);
  });
  it('should handle negative price', () => {
    expect(calculateDiscount(-10, 'SAVE10')).toMatch(/invalid/i);
  });
  it('should handle discount code if it is not string', () => {
    expect(calculateDiscount(-10, 10)).toMatch(/invalid/i);
  });
  it('should handle when the discount code is invalid', () => {
    expect(calculateDiscount(10, 'INVALID')).toBe(10);
  });
});

describe('validateUserInput', () => {
  it('should return success if given valid input', () => {
    expect(validateUserInput('Mona', 20)).toMatch(/success/i);
  });
  it('should return error if username is not string', () => {
    expect(validateUserInput(1, 20)).toMatch(/invalid/i);
  });
  it('should return error if username is less than 3 characters', () => {
    expect(validateUserInput('mo', 20)).toMatch(/invalid/i);
  });
  it('should return error if age is not number', () => {
    expect(validateUserInput('mona', '10')).toMatch(/invalid/i);
  });
  it('should return error if age is less than 18', () => {
    expect(validateUserInput('mona', 10)).toMatch(/invalid/i);
  });
  it('should return error if username and age are not valid', () => {
    expect(validateUserInput('', 0)).toMatch(/invalid username/i);
    expect(validateUserInput('', 0)).toMatch(/invalid age/i);
  });
});

// describe('isPriceInRange', () => {
//     it('should return false if price is outside the range', () => {
//         expect(isPriceInRange(-10, 0, 100)).toBe(false);
//         expect(isPriceInRange(110, 0, 100)).toBe(false);
//     })
//     it('should return false if price is equal to min and max', () => {
//         expect(isPriceInRange(0, 0, 100)).toBe(true);
//         expect(isPriceInRange(100, 0, 100)).toBe(true);
//     })
//     it('should return true if price is within the range', () => {
//         expect(isPriceInRange(50, 0, 100)).toBe(true);
//     })
// })

describe('isValidUsername', () => {
  const minLength = 5;
  const maxLength = 15;
  it('should return true if the username length is within the range.', () => {
    expect(isValidUsername('m'.repeat(minLength + 1))).toBe(true);
    expect(isValidUsername('m'.repeat(maxLength - 1))).toBe(true);
  });
  it('should return true if the username length is out of the range.', () => {
    expect(isValidUsername('m'.repeat(minLength - 1))).toBe(false);
    expect(isValidUsername('m'.repeat(maxLength + 1))).toBe(false);
  });
  it('should return true if the username length is equal to min and max.', () => {
    expect(isValidUsername('m'.repeat(minLength))).toBe(true);
    expect(isValidUsername('m'.repeat(maxLength))).toBe(true);
  });
  it('should return false if the username is null', () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(1)).toBe(false);
  });
});

describe('canDrive', () => {
  it('should return invalid if the country code is not present', () => {
    expect(canDrive(18, 'Invalid')).toMatch(/invalid/i);
    expect(canDrive(18, 1)).toMatch(/invalid/i);
  });
  it('should return true if the country code is present', () => {
    expect(canDrive(17, 'US')).toBe(true);
    expect(canDrive(17, 'UK')).toBe(true);
  });
  it('should return false if the age is lower', () => {
    expect(canDrive(15, 'US')).toBe(false);
    expect(canDrive(16, 'UK')).toBe(false);
  });
});

describe('isPriceInRange', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  it.each([
    {
      scenario: 'price is below min',
      price: -10,
      min: 0,
      max: 100,
      result: false,
    },
    {
      scenario: 'price is above max',
      price: -10,
      min: 0,
      max: 100,
      result: false,
    },
    {
      scenario: 'price is equal to min',
      price: 0,
      min: 0,
      max: 100,
      result: true,
    },
    {
      scenario: 'price is equal to max',
      price: 0,
      min: 0,
      max: 100,
      result: true,
    },
    {
      scenario: 'price is within the range',
      price: 15,
      min: 0,
      max: 100,
      result: true,
    },
  ])('should return $result if the scenario'),
    ({ price, min, max, result }) => {
      expect(isPriceInRange(price, min, max)).toBe(result);
    };
});

describe('fetchData', () => {
  it('should return a promise that will resolve to an array of numbers', async () => {
    // const result = await fetchData();
    // expect(Array.isArray(result)).toBe(true);
    // expect(result.length).toBeGreaterThan(0);
    try {
      await fetchData();
    } catch (error) {
      expect(error).toHaveProperty('reason');
      expect(error.reason).toMatch(/fail/i);
    }
  });
});

describe('test suite', () => {
  beforeAll(() => {
    console.log('beforeAll called');
  });
  beforeEach(() => {
    console.log('beforeEach called');
  });
  afterEach(() => {
    console.log('afterEach called');
  });
  afterAll(() => {
    console.log('afterAll called');
  });
  it('test case 1', () => {});
  it('test case 2', () => {});
});

describe('Stack', () => {
  let stack;
  beforeEach(() => {
    stack = new Stack();
  });
  it('push should add to a stack', () => {
    stack.push(1);
    expect(stack.size()).toBe(1);
  });
  it('pop should return top item', () => {
    stack.push(1);
    stack.push(2);
    const poppedItem = stack.pop();
    expect(poppedItem).toBe(2);
    expect(stack.size()).toBe(1);
  });
  it('pop should throw error if stack is empty', () => {
    expect(() => stack.pop()).toThrow(/empty/i);
  });
  it('peek should return the top item from stack', () => {
    stack.push(1);
    stack.push(2);
    const item = stack.peek();
    expect(item).toBe(2);
    expect(stack.size()).toBe(2);
  });
  it('peek should throw error if stack is empty', () => {
    expect(() => stack.peek()).toThrow(/empty/i);
  });
  it('should return false if stack is not empty', () => {
    stack.push(1);
    const result = stack.isEmpty();
    expect(result).toBe(false);
  });
  it('should return true if stack is empty', () => {
    const result = stack.isEmpty();
    expect(result).toBe(true);
  });
  it('should return size of a stack', () => {
    expect(stack.size()).toBe(0);
  });
  it('should clear the stack', () => {
    stack.push(1);
    stack.clear();
    expect(stack.size()).toBe(0);
  });
});
