/**
 * Button Component Page Object
 * Handles interactions with Button components
 */

export class ButtonComponent {
  constructor(page) {
    this.page = page;
  }

  /**
   * Click a button by test ID
   */
  async clickButton(testId = 'button') {
    await this.page.click(`[data-testid="${testId}"]`);
  }

  /**
   * Get button text
   */
  async getButtonText(testId = 'button') {
    return await this.page.textContent(`[data-testid="${testId}"]`);
  }

  /**
   * Check if button is disabled
   */
  async isButtonDisabled(testId = 'button') {
    return await this.page.isDisabled(`[data-testid="${testId}"]`);
  }

  /**
   * Check if button is visible
   */
  async isButtonVisible(testId = 'button') {
    return await this.page.isVisible(`[data-testid="${testId}"]`);
  }

  /**
   * Get button class attribute (for checking variant)
   */
  async getButtonClass(testId = 'button') {
    return await this.page.getAttribute(`[data-testid="${testId}"]`, 'class');
  }

  /**
   * Wait for button to be enabled
   */
  async waitForButtonEnabled(testId = 'button') {
    await this.page.waitForSelector(`[data-testid="${testId}"]:not([disabled])`, {
      state: 'visible'
    });
  }
}
