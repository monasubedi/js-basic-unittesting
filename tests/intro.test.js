import { describe, expect, it } from 'vitest';
import { fizzBuzz, max } from '../src/intro';

describe('max', () => {
  it('should return the first argument if it is greater', () => {
    expect(max(2, 1)).toBe(2);
  });
  it('should return the second argument if it is greater', () => {
    expect(max(1, 2)).toBe(2);
  });
  it('should return the first argument if it has same arguments', () => {
    expect(max(1, 1)).toBe(1);
  });
});

describe('fizzbuzz', () => {
  it('should return Fizz Buzz if it is both divisible by 3 and 5', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz');
  });
  it('should return Fizz if it is divisible by 3', () => {
    expect(fizzBuzz(6)).toBe('Fizz');
  });
  it('should return Buzz if it is divisible by 3', () => {
    expect(fizzBuzz(10)).toBe('Buzz');
  });
  it('should return string if it is not divisible by 3 or 5', () => {
    expect(fizzBuzz(1)).toBe('1');
  });
});
