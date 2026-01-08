/**
 * Counter Component E2E Tests
 * Tests for Counter component state management and interactions
 */

import { test, expect } from './fixtures/index.js';

test.describe('Counter Component', () => {
  test.beforeEach(async ({ page, counterComponent }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should render counter component', async ({ counterComponent }) => {
    expect(await counterComponent.isVisible()).toBe(true);
  });

  test('should display initial count of 0', async ({ counterComponent }) => {
    const count = await counterComponent.getCount();
    expect(count).toBe(0);
  });

  test('should increment counter', async ({ counterComponent }) => {
    await counterComponent.increment();
    const count = await counterComponent.getCount();
    expect(count).toBe(1);
  });

  test('should decrement counter', async ({ counterComponent }) => {
    // First increment to get to 1
    await counterComponent.increment();
    
    // Then decrement back to 0
    await counterComponent.decrement();
    const count = await counterComponent.getCount();
    expect(count).toBe(0);
  });

  test('should increment multiple times', async ({ counterComponent }) => {
    await counterComponent.incrementBy(5);
    const count = await counterComponent.getCount();
    expect(count).toBe(5);
  });

  test('should decrement multiple times', async ({ counterComponent }) => {
    // First increment to 5
    await counterComponent.incrementBy(5);
    
    // Then decrement by 3
    await counterComponent.decrementBy(3);
    const count = await counterComponent.getCount();
    expect(count).toBe(2);
  });

  test('should reset counter to initial value', async ({ counterComponent }) => {
    // Increment counter
    await counterComponent.incrementBy(5);
    expect(await counterComponent.getCount()).toBe(5);
    
    // Reset
    await counterComponent.reset();
    const count = await counterComponent.getCount();
    expect(count).toBe(0);
  });

  test('should not decrement below minimum value', async ({ counterComponent }) => {
    // Counter has min=0, so it shouldn't go below 0
    await counterComponent.decrement();
    const count = await counterComponent.getCount();
    expect(count).toBe(0);
    
    // Try to decrement again
    await counterComponent.decrement();
    expect(await counterComponent.getCount()).toBe(0);
  });

  test('should not increment above maximum value', async ({ counterComponent }) => {
    // Counter has max=10
    await counterComponent.incrementBy(10);
    expect(await counterComponent.getCount()).toBe(10);
    
    // Try to increment beyond max
    await counterComponent.increment();
    expect(await counterComponent.getCount()).toBe(10);
  });

  test('should disable decrement button at minimum', async ({ counterComponent }) => {
    // At initial count of 0 (minimum), decrement should be disabled
    expect(await counterComponent.isDecrementDisabled()).toBe(true);
    
    // Increment once, decrement should be enabled
    await counterComponent.increment();
    expect(await counterComponent.isDecrementDisabled()).toBe(false);
    
    // Decrement back to minimum
    await counterComponent.decrement();
    expect(await counterComponent.isDecrementDisabled()).toBe(true);
  });

  test('should disable increment button at maximum', async ({ counterComponent }) => {
    // Increment to maximum (10)
    await counterComponent.incrementBy(10);
    expect(await counterComponent.getCount()).toBe(10);
    
    // Increment button should be disabled
    expect(await counterComponent.isIncrementDisabled()).toBe(true);
    
    // Decrement once, increment should be enabled
    await counterComponent.decrement();
    expect(await counterComponent.isIncrementDisabled()).toBe(false);
  });

  test('should handle rapid clicks', async ({ counterComponent }) => {
    // Click increment rapidly
    await counterComponent.increment();
    await counterComponent.increment();
    await counterComponent.increment();
    await counterComponent.increment();
    await counterComponent.increment();
    
    const count = await counterComponent.getCount();
    expect(count).toBe(5);
  });

  test('should maintain state after reset and new operations', async ({ counterComponent }) => {
    // Increment
    await counterComponent.incrementBy(5);
    expect(await counterComponent.getCount()).toBe(5);
    
    // Reset
    await counterComponent.reset();
    expect(await counterComponent.getCount()).toBe(0);
    
    // Increment again
    await counterComponent.incrementBy(3);
    expect(await counterComponent.getCount()).toBe(3);
    
    // Decrement
    await counterComponent.decrementBy(2);
    expect(await counterComponent.getCount()).toBe(1);
  });

  test('should update display in real-time', async ({ counterComponent }) => {
    const initialCount = await counterComponent.getCount();
    
    await counterComponent.increment();
    await counterComponent.waitForCount(initialCount + 1);
    
    await counterComponent.increment();
    await counterComponent.waitForCount(initialCount + 2);
  });

  test('should handle mixed increment and decrement operations', async ({ counterComponent }) => {
    await counterComponent.increment(); // 1
    await counterComponent.increment(); // 2
    await counterComponent.increment(); // 3
    await counterComponent.decrement(); // 2
    await counterComponent.increment(); // 3
    await counterComponent.decrement(); // 2
    await counterComponent.decrement(); // 1
    
    const count = await counterComponent.getCount();
    expect(count).toBe(1);
  });

  test('should be keyboard accessible', async ({ page, counterComponent }) => {
    // Focus on increment button and press Enter
    const incrementBtn = await page.locator('[data-testid="increment-button"]');
    await incrementBtn.focus();
    await page.keyboard.press('Enter');
    
    expect(await counterComponent.getCount()).toBe(1);
    
    // Focus on decrement button and press Enter
    const decrementBtn = await page.locator('[data-testid="decrement-button"]');
    await decrementBtn.focus();
    await page.keyboard.press('Enter');
    
    expect(await counterComponent.getCount()).toBe(0);
  });

  test('should display counter value prominently', async ({ page }) => {
    const display = await page.locator('[data-testid="counter-display"]');
    
    // Check that the display is visible
    expect(await display.isVisible()).toBe(true);
    
    // Check that it has content
    const text = await display.textContent();
    expect(text).toBeTruthy();
  });

  test('should maintain state during page interactions', async ({ page, counterComponent }) => {
    // Increment counter
    await counterComponent.incrementBy(7);
    expect(await counterComponent.getCount()).toBe(7);
    
    // Scroll page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.evaluate(() => window.scrollTo(0, 0));
    
    // Counter should maintain its state
    expect(await counterComponent.getCount()).toBe(7);
  });
});
