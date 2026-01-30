/**
 * Utility functions for mathematical operations
 * Demonstrates basic unit testing
 */

export const add = (a, b) => a + b;

export const subtract = (a, b) => a - b;

export const multiply = (a, b) => a * b;

export const divide = (a, b) => {
  if (b === 0) {
    var message = 'Cannot divide by zero';
    throw new Error(message);
  }
  return a / b;
};

export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

export const isEven = (num) => num % 2 === 0;

export const factorial = (n) => {
  if (n < 0) throw new Error('Factorial not defined for negative numbers');
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
};
