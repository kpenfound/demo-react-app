/**
 * UserList Component Page Object
 * Handles interactions with the UserList component
 */

export class UserListComponent {
  constructor(page) {
    this.page = page;
    
    // Selectors
    this.selectors = {
      userList: '[data-testid="user-list"]',
      loading: '[data-testid="loading"]',
      error: '[data-testid="error"]',
      users: '[data-testid="users"]',
      noUsers: '[data-testid="no-users"]',
      refreshButton: '[data-testid="refresh-button"]',
      retryButton: '[data-testid="retry-button"]',
    };
  }

  /**
   * Check if loading state is visible
   */
  async isLoading() {
    return await this.page.isVisible(this.selectors.loading);
  }

  /**
   * Check if error state is visible
   */
  async isError() {
    return await this.page.isVisible(this.selectors.error);
  }

  /**
   * Get error message
   */
  async getErrorMessage() {
    return await this.page.textContent(this.selectors.error);
  }

  /**
   * Check if user list is visible
   */
  async isUserListVisible() {
    return await this.page.isVisible(this.selectors.userList);
  }

  /**
   * Wait for users to load
   */
  async waitForUsers(timeout = 10000) {
    await this.page.waitForSelector(this.selectors.users, { 
      state: 'visible',
      timeout 
    });
  }

  /**
   * Wait for loading to finish
   */
  async waitForLoadingToFinish(timeout = 10000) {
    await this.page.waitForSelector(this.selectors.loading, { 
      state: 'hidden',
      timeout 
    });
  }

  /**
   * Get all user items
   */
  async getUsers() {
    return await this.page.$$(`${this.selectors.users} li`);
  }

  /**
   * Get user count
   */
  async getUserCount() {
    const users = await this.getUsers();
    return users.length;
  }

  /**
   * Get user by index
   */
  async getUserByIndex(index) {
    const users = await this.getUsers();
    if (index < users.length) {
      return await users[index].textContent();
    }
    return null;
  }

  /**
   * Get specific user by ID
   */
  async getUserById(userId) {
    return await this.page.textContent(`[data-testid="user-${userId}"]`);
  }

  /**
   * Check if specific user exists
   */
  async hasUser(userId) {
    return await this.page.isVisible(`[data-testid="user-${userId}"]`);
  }

  /**
   * Click refresh button
   */
  async refresh() {
    await this.page.click(this.selectors.refreshButton);
  }

  /**
   * Click retry button (shown on error)
   */
  async retry() {
    await this.page.click(this.selectors.retryButton);
  }

  /**
   * Check if no users message is visible
   */
  async isNoUsersMessageVisible() {
    return await this.page.isVisible(this.selectors.noUsers);
  }

  /**
   * Wait for error to appear
   */
  async waitForError(timeout = 5000) {
    await this.page.waitForSelector(this.selectors.error, {
      state: 'visible',
      timeout
    });
  }
}
