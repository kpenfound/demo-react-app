/**
 * String utility functions
 * Demonstrates testing with various data types and edge cases
 */

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str, length) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const reverseString = (str) => {
  if (!str) return '';
  return str.split('').reverse().join('');
};

export const isPalindrome = (str) => {
  if (!str) return false;
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
};

export const countWords = (str) => {
  if (!str || !str.trim()) return 0;
  return str.trim().split(/\s+/).length;
};

export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
