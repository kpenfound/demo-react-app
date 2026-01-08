/**
 * Tests for stringUtils
 * Demonstrates: test.each (parameterized tests), edge cases, null/undefined handling
 */

import {
  capitalize,
  truncate,
  reverseString,
  isPalindrome,
  countWords,
  slugify,
} from './stringUtils';

describe('stringUtils', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should lowercase rest of the string', () => {
      expect(capitalize('hELLO')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle null and undefined', () => {
      expect(capitalize(null)).toBe('');
      expect(capitalize(undefined)).toBe('');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should handle exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(truncate('', 5)).toBe('');
    });
  });

  describe('reverseString', () => {
    it('should reverse a string', () => {
      expect(reverseString('hello')).toBe('olleh');
    });

    it('should handle single character', () => {
      expect(reverseString('a')).toBe('a');
    });

    it('should handle empty string', () => {
      expect(reverseString('')).toBe('');
    });
  });

  describe('isPalindrome', () => {
    // Demonstrates parameterized testing with test.each
    test.each([
      ['racecar', true],
      ['A man a plan a canal Panama', true],
      ['hello', false],
      ['', false],
      ['a', true],
    ])('isPalindrome(%s) should return %s', (input, expected) => {
      expect(isPalindrome(input)).toBe(expected);
    });
  });

  describe('countWords', () => {
    it('should count words correctly', () => {
      expect(countWords('hello world')).toBe(2);
    });

    it('should handle multiple spaces', () => {
      expect(countWords('hello   world')).toBe(2);
    });

    it('should handle leading and trailing spaces', () => {
      expect(countWords('  hello world  ')).toBe(2);
    });

    it('should return 0 for empty string', () => {
      expect(countWords('')).toBe(0);
      expect(countWords('   ')).toBe(0);
    });

    it('should handle single word', () => {
      expect(countWords('hello')).toBe(1);
    });
  });

  describe('slugify', () => {
    test.each([
      ['Hello World', 'hello-world'],
      ['Hello  World', 'hello-world'],
      ['Hello_World', 'hello-world'],
      ['Hello!@# World', 'hello-world'],
      ['  Hello World  ', 'hello-world'],
      ['', ''],
    ])('slugify(%s) should return %s', (input, expected) => {
      expect(slugify(input)).toBe(expected);
    });
  });
});
