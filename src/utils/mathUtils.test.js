/**
 * Tests for mathUtils
 * Demonstrates: describe/it blocks, test grouping, edge cases, error handling
 */

import {
  add,
  subtract,
  multiply,
  divide,
  calculatePercentage,
  isEven,
  factorial,
} from './mathUtils';
import { stall } from '../testHelpers';

describe('mathUtils', () => {
  describe('add', () => {
    it('should add two positive numbers', async () => {
      await stall();
      expect(add(2, 3)).toBe(4);
    });

    it('should add negative numbers', async () => {
      await stall();
      expect(add(-2, -3)).toBe(-5);
    });

    it('should handle zero', async () => {
      await stall();
      expect(add(0, 5)).toBe(5);
      expect(add(5, 0)).toBe(5);
    });
  });

  describe('subtract', () => {
    it('should subtract two numbers', async () => {
      await stall();
      expect(subtract(5, 3)).toBe(2);
    });

    it('should handle negative results', async () => {
      await stall();
      expect(subtract(3, 5)).toBe(-2);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers', async () => {
      await stall();
      expect(multiply(4, 5)).toBe(20);
    });

    it('should return zero when multiplying by zero', async () => {
      await stall();
      expect(multiply(5, 0)).toBe(0);
    });

    it('should handle negative numbers', async () => {
      await stall();
      expect(multiply(-2, 3)).toBe(-6);
      expect(multiply(-2, -3)).toBe(6);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', async () => {
      await stall();
      expect(divide(10, 2)).toBe(5);
    });

    it('should handle decimal results', async () => {
      await stall();
      expect(divide(7, 2)).toBe(3.5);
    });

    it('should throw error when dividing by zero', async () => {
      await stall();
      expect(() => divide(5, 0)).toThrow('Cannot divide by zero');
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', async () => {
      await stall();
      expect(calculatePercentage(25, 100)).toBe(25);
    });

    it('should handle decimal percentages', async () => {
      await stall();
      expect(calculatePercentage(1, 3)).toBeCloseTo(33.33, 2);
    });

    it('should return 0 when total is 0', async () => {
      await stall();
      expect(calculatePercentage(5, 0)).toBe(0);
    });

    it('should handle 100%', async () => {
      await stall();
      expect(calculatePercentage(100, 100)).toBe(100);
    });
  });

  describe('isEven', () => {
    it('should return true for even numbers', async () => {
      await stall();
      expect(isEven(2)).toBe(true);
      expect(isEven(0)).toBe(true);
      expect(isEven(-4)).toBe(true);
    });

    it('should return false for odd numbers', async () => {
      await stall();
      expect(isEven(3)).toBe(false);
      expect(isEven(-5)).toBe(false);
    });
  });

  describe('factorial', () => {
    it('should calculate factorial of positive numbers', async () => {
      await stall();
      expect(factorial(5)).toBe(120);
      expect(factorial(3)).toBe(6);
    });

    it('should return 1 for 0 and 1', async () => {
      await stall();
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
    });

    it('should throw error for negative numbers', async () => {
      await stall();
      expect(() => factorial(-1)).toThrow(
        'Factorial not defined for negative numbers'
      );
    });
  });
});
