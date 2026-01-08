/**
 * Counter Component Page Object
 * Handles interactions with the Counter component
 */

export class CounterComponent {
  constructor(page) {
    this.page = page;

    // Selectors
    this.selectors = {
      counter: '[data-testid="counter"]',
      display: '[data-testid="counter-display"]',
      incrementButton: '[data-testid="increment-button"]',
      decrementButton: '[data-testid="decrement-button"]',
      resetButton: '[data-testid="reset-button"]',
    };
  }

  /**
   * Get the current count value
   */
  async getCount() {
    const text = await this.page.textContent(this.selectors.display);
    return parseInt(text.trim(), 10);
  }

  /**
   * Click the increment button
   */
  async increment() {
    await this.page.click(this.selectors.incrementButton);
  }

  /**
   * Click the decrement button
   */
  async decrement() {
    await this.page.click(this.selectors.decrementButton);
  }

  /**
   * Click the reset button
   */
  async reset() {
    await this.page.click(this.selectors.resetButton);
  }

  /**
   * Increment multiple times
   */
  async incrementBy(times) {
    for (let i = 0; i < times; i++) {
      await this.increment();
    }
  }

  /**
   * Decrement multiple times
   */
  async decrementBy(times) {
    for (let i = 0; i < times; i++) {
      await this.decrement();
    }
  }

  /**
   * Check if increment button is disabled
   */
  async isIncrementDisabled() {
    return await this.page.isDisabled(this.selectors.incrementButton);
  }

  /**
   * Check if decrement button is disabled
   */
  async isDecrementDisabled() {
    return await this.page.isDisabled(this.selectors.decrementButton);
  }

  /**
   * Check if counter is visible
   */
  async isVisible() {
    return await this.page.isVisible(this.selectors.counter);
  }

  /**
   * Wait for count to be a specific value
   */
  async waitForCount(expectedCount, timeout = 5000) {
    await this.page.waitForFunction(
      (sel, expected) => {
        const el = document.querySelector(sel);
        return el && parseInt(el.textContent.trim(), 10) === expected;
      },
      [this.selectors.display, expectedCount],
      { timeout }
    );
  }
}
