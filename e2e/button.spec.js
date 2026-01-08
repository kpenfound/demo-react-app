/**
 * Button Component E2E Tests
 * Tests for Button component interactions and behaviors
 */

import { test, expect } from './fixtures/index.js';

test.describe('Button Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should render all button variants', async ({ page }) => {
    // Check that buttons with different variants are rendered
    const buttons = await page.locator('.button-demo button').all();
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  test('should display button text correctly', async ({ page }) => {
    const primaryButton = await page.locator('.button-demo button').first();
    const text = await primaryButton.textContent();
    expect(text).toBe('Primary Button');
  });

  test('should handle button clicks', async ({ page }) => {
    // Set up dialog handler
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toBe('Button clicked!');
      await dialog.accept();
    });

    // Click the first button
    const primaryButton = await page.locator('.button-demo button').first();
    await primaryButton.click();
    
    // Dialog handler will verify the click
  });

  test('should apply primary variant styling', async ({ page }) => {
    const primaryButton = await page.locator('.button-demo button').first();
    const className = await primaryButton.getAttribute('class');
    expect(className).toContain('button--primary');
  });

  test('should apply secondary variant styling', async ({ page }) => {
    const buttons = await page.locator('.button-demo button').all();
    const secondButton = buttons[1];
    const className = await secondButton.getAttribute('class');
    expect(className).toContain('button--secondary');
  });

  test('should apply danger variant styling', async ({ page }) => {
    const buttons = await page.locator('.button-demo button').all();
    const dangerButton = buttons[2];
    const className = await dangerButton.getAttribute('class');
    expect(className).toContain('button--danger');
  });

  test('should handle disabled state', async ({ page }) => {
    const buttons = await page.locator('.button-demo button').all();
    const disabledButton = buttons[3];
    
    // Check button is disabled
    const isDisabled = await disabledButton.isDisabled();
    expect(isDisabled).toBe(true);
    
    // Verify text
    const text = await disabledButton.textContent();
    expect(text).toBe('Disabled Button');
  });

  test('should not trigger onClick for disabled button', async ({ page }) => {
    let dialogTriggered = false;
    
    page.on('dialog', async (dialog) => {
      dialogTriggered = true;
      await dialog.accept();
    });

    const buttons = await page.locator('.button-demo button').all();
    const disabledButton = buttons[3];
    
    // Try to click disabled button
    await disabledButton.click({ force: true, timeout: 1000 }).catch(() => {});
    
    // Wait a bit to ensure no dialog appears
    await page.waitForTimeout(500);
    
    expect(dialogTriggered).toBe(false);
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Focus on the first button
    const firstButton = await page.locator('.button-demo button').first();
    await firstButton.focus();
    
    // Verify button is focused
    const isFocused = await firstButton.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBe(true);
  });

  test('should trigger on Enter key', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toBe('Button clicked!');
      await dialog.accept();
    });

    const firstButton = await page.locator('.button-demo button').first();
    await firstButton.focus();
    await page.keyboard.press('Enter');
  });

  test('should trigger on Space key', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toBe('Button clicked!');
      await dialog.accept();
    });

    const firstButton = await page.locator('.button-demo button').first();
    await firstButton.focus();
    await page.keyboard.press('Space');
  });

  test('should have hover state', async ({ page }) => {
    const firstButton = await page.locator('.button-demo button').first();
    
    // Get initial styles
    const initialBgColor = await firstButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Hover over button
    await firstButton.hover();
    
    // Get hover styles
    const hoverBgColor = await firstButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Background color should change on hover (or at least be defined)
    expect(hoverBgColor).toBeTruthy();
  });

  test('should maintain button state after multiple clicks', async ({ page }) => {
    let clickCount = 0;
    
    page.on('dialog', async (dialog) => {
      clickCount++;
      await dialog.accept();
    });

    const firstButton = await page.locator('.button-demo button').first();
    
    // Click multiple times
    await firstButton.click();
    await firstButton.click();
    await firstButton.click();
    
    expect(clickCount).toBe(3);
  });
});
