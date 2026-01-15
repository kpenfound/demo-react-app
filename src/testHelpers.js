/**
 * Test Helper Utilities
 * Provides common functions for tests
 */

/**
 * Introduces a random delay between 0.5 and 3 seconds
 * Useful for demonstrating test visualization and timing
 * @returns {Promise<void>}
 */
export const stall = () => {
  const minDelay = 500; // 0.5 seconds in milliseconds
  const maxDelay = 3000; // 3 seconds in milliseconds
  const randomDelay =
    Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  return new Promise((resolve) => setTimeout(resolve, randomDelay));
};
