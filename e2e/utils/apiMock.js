/**
 * API Mocking Utilities
 * Provides helpers for mocking API responses in tests
 */

/**
 * Mock successful users API response
 */
export async function mockUsersSuccess(page, users = null) {
  const defaultUsers = users || [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com' },
  ];

  await page.route('**/api/users*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(defaultUsers),
    });
  });
}

/**
 * Mock API error response
 */
export async function mockUsersError(page, errorMessage = 'Failed to fetch users') {
  await page.route('**/api/users*', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: errorMessage }),
    });
  });
}

/**
 * Mock empty users response
 */
export async function mockUsersEmpty(page) {
  await page.route('**/api/users*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });
}

/**
 * Mock slow API response (for testing loading states)
 */
export async function mockUsersSlowResponse(page, delayMs = 2000, users = null) {
  const defaultUsers = users || [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  await page.route('**/api/users*', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(defaultUsers),
    });
  });
}

/**
 * Mock network timeout
 */
export async function mockUsersTimeout(page) {
  await page.route('**/api/users*', async (route) => {
    await route.abort('timedout');
  });
}

/**
 * Intercept and track API calls
 */
export class APIInterceptor {
  constructor() {
    this.calls = [];
  }

  /**
   * Start intercepting API calls
   */
  async intercept(page, pattern = '**/api/**') {
    await page.route(pattern, async (route) => {
      this.calls.push({
        url: route.request().url(),
        method: route.request().method(),
        headers: route.request().headers(),
        timestamp: Date.now(),
      });
      await route.continue();
    });
  }

  /**
   * Get all intercepted calls
   */
  getCalls() {
    return this.calls;
  }

  /**
   * Get call count
   */
  getCallCount() {
    return this.calls.length;
  }

  /**
   * Clear intercepted calls
   */
  clear() {
    this.calls = [];
  }

  /**
   * Wait for a specific number of calls
   */
  async waitForCalls(count, timeout = 5000) {
    const startTime = Date.now();
    while (this.calls.length < count) {
      if (Date.now() - startTime > timeout) {
        throw new Error(`Timeout waiting for ${count} API calls. Got ${this.calls.length}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}
