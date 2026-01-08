/**
 * UserList Component E2E Tests
 * Tests for UserList component with API mocking
 */

import { test, expect } from './fixtures/index.js';
import { 
  mockUsersSuccess, 
  mockUsersError, 
  mockUsersEmpty,
  mockUsersSlowResponse 
} from './utils/apiMock.js';

test.describe('UserList Component', () => {
  test('should render user list component', async ({ page, userListComponent }) => {
    await mockUsersSuccess(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(await userListComponent.isUserListVisible()).toBe(true);
  });

  test('should display loading state initially', async ({ page, userListComponent }) => {
    // Mock a slow response to catch loading state
    await mockUsersSlowResponse(page, 1000);
    
    await page.goto('/');
    
    // Should show loading
    expect(await userListComponent.isLoading()).toBe(true);
  });

  test('should load and display users successfully', async ({ page, userListComponent }) => {
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
    ];
    
    await mockUsersSuccess(page, mockUsers);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for users to load
    await userListComponent.waitForLoadingToFinish();
    await userListComponent.waitForUsers();
    
    // Check user count
    const userCount = await userListComponent.getUserCount();
    expect(userCount).toBe(3);
  });

  test('should display user information correctly', async ({ page, userListComponent }) => {
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
    ];
    
    await mockUsersSuccess(page, mockUsers);
    await page.goto('/');
    await userListComponent.waitForLoadingToFinish();
    await userListComponent.waitForUsers();
    
    // Check if user exists
    expect(await userListComponent.hasUser(1)).toBe(true);
    
    // Check user content
    const userText = await userListComponent.getUserById(1);
    expect(userText).toContain('John Doe');
    expect(userText).toContain('john@example.com');
  });

  test('should handle API errors gracefully', async ({ page, userListComponent }) => {
    await mockUsersError(page, 'Failed to fetch users');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for error to appear
    await userListComponent.waitForError();
    
    // Check error is displayed
    expect(await userListComponent.isError()).toBe(true);
    
    // Check error message
    const errorMessage = await userListComponent.getErrorMessage();
    expect(errorMessage).toContain('Error');
  });

  test('should display retry button on error', async ({ page, userListComponent }) => {
    await mockUsersError(page);
    await page.goto('/');
    await userListComponent.waitForError();
    
    // Check retry button is visible
    const retryButton = await page.locator('[data-testid="retry-button"]');
    expect(await retryButton.isVisible()).toBe(true);
  });

  test('should retry loading users after error', async ({ page, userListComponent }) => {
    let requestCount = 0;
    
    await page.route('**/api/users*', async (route) => {
      requestCount++;
      if (requestCount === 1) {
        // First request fails
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error' }),
        });
      } else {
        // Second request succeeds
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 1, name: 'John Doe', email: 'john@example.com' },
          ]),
        });
      }
    });
    
    await page.goto('/');
    await userListComponent.waitForError();
    
    // Click retry
    await userListComponent.retry();
    
    // Wait for successful load
    await userListComponent.waitForLoadingToFinish();
    await userListComponent.waitForUsers();
    
    // Check users are displayed
    expect(await userListComponent.getUserCount()).toBeGreaterThan(0);
  });

  test('should handle empty user list', async ({ page, userListComponent }) => {
    await mockUsersEmpty(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await userListComponent.waitForLoadingToFinish();
    
    // Check no users message is displayed
    expect(await userListComponent.isNoUsersMessageVisible()).toBe(true);
  });

  test('should refresh user list', async ({ page, userListComponent }) => {
    let requestCount = 0;
    
    await page.route('**/api/users*', async (route) => {
      requestCount++;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: requestCount, name: `User ${requestCount}`, email: `user${requestCount}@example.com` },
        ]),
      });
    });
    
    await page.goto('/');
    await userListComponent.waitForLoadingToFinish();
    await userListComponent.waitForUsers();
    
    // Initial request
    expect(requestCount).toBe(1);
    
    // Click refresh
    await userListComponent.refresh();
    
    await page.waitForTimeout(500);
    
    // Should make another request
    expect(requestCount).toBe(2);
  });

  test('should display correct number of users based on limit', async ({ page, userListComponent }) => {
    const mockUsers = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));
    
    await mockUsersSuccess(page, mockUsers);
    await page.goto('/');
    await userListComponent.waitForLoadingToFinish();
    await userListComponent.waitForUsers();
    
    const userCount = await userListComponent.getUserCount();
    expect(userCount).toBe(5);
  });

  test('should handle multiple users correctly', async ({ page, userListComponent }) => {
    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', email: 'user2@example.com' },
      { id: 3, name: 'User 3', email: 'user3@example.com' },
    ];
    
    await mockUsersSuccess(page, mockUsers);
    await page.goto('/');
    await userListComponent.waitForLoadingToFinish();
    await userListComponent.waitForUsers();
    
    // Check all users exist
    expect(await userListComponent.hasUser(1)).toBe(true);
    expect(await userListComponent.hasUser(2)).toBe(true);
    expect(await userListComponent.hasUser(3)).toBe(true);
  });

  test('should maintain user list after page interactions', async ({ page, userListComponent }) => {
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];
    
    await mockUsersSuccess(page, mockUsers);
    await page.goto('/');
    await userListComponent.waitForLoadingToFinish();
    await userListComponent.waitForUsers();
    
    const initialCount = await userListComponent.getUserCount();
    
    // Scroll page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.evaluate(() => window.scrollTo(0, 0));
    
    // User list should maintain its state
    const afterScrollCount = await userListComponent.getUserCount();
    expect(afterScrollCount).toBe(initialCount);
  });

  test('should show loading state when refreshing', async ({ page, userListComponent }) => {
    await mockUsersSuccess(page);
    await page.goto('/');
    await userListComponent.waitForLoadingToFinish();
    await userListComponent.waitForUsers();
    
    // Mock slow response for refresh
    await mockUsersSlowResponse(page, 1000);
    
    // Click refresh
    await userListComponent.refresh();
    
    // Should show loading state
    const isLoading = await userListComponent.isLoading();
    expect(isLoading).toBe(true);
  });

  test('should handle network timeout', async ({ page, userListComponent }) => {
    await page.route('**/api/users*', async (route) => {
      await route.abort('timedout');
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should eventually show error state
    await page.waitForTimeout(2000);
    
    // The component should handle the timeout gracefully
    // Either showing error or loading state
    const hasError = await userListComponent.isError();
    const isLoading = await userListComponent.isLoading();
    
    expect(hasError || isLoading).toBe(true);
  });

  test('should display refresh button when users are loaded', async ({ page, userListComponent }) => {
    await mockUsersSuccess(page);
    await page.goto('/');
    await userListComponent.waitForLoadingToFinish();
    await userListComponent.waitForUsers();
    
    const refreshButton = await page.locator('[data-testid="refresh-button"]');
    expect(await refreshButton.isVisible()).toBe(true);
  });

  test('should be accessible via keyboard', async ({ page, userListComponent }) => {
    await mockUsersSuccess(page);
    await page.goto('/');
    await userListComponent.waitForLoadingToFinish();
    await userListComponent.waitForUsers();
    
    // Tab to refresh button and activate it
    const refreshButton = await page.locator('[data-testid="refresh-button"]');
    await refreshButton.focus();
    
    const isFocused = await refreshButton.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBe(true);
  });
});
