/**
 * Base Page Object
 * Provides common functionality for all page objects
 */

export class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a specific path
   */
  async goto(path = '/') {
    await this.page.goto(path);
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Take a screenshot
   */
  async screenshot(options) {
    return await this.page.screenshot(options);
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector) {
    return await this.page.isVisible(selector);
  }

  /**
   * Wait for selector with timeout
   */
  async waitForSelector(selector, options = {}) {
    return await this.page.waitForSelector(selector, options);
  }
}
