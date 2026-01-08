/**
 * App Smoke Tests
 * Basic tests to verify the application loads and renders correctly
 */

import { test, expect } from './fixtures/index.js';

test.describe('App Smoke Tests', () => {
  test('should load the application successfully', async ({ page, appPage }) => {
    await appPage.navigate();
    
    // Verify page title
    const title = await appPage.getTitle();
    expect(title).toBeTruthy();
    
    // Verify app is loaded
    await expect(page).toHaveURL('/');
    expect(await appPage.isAppLoaded()).toBe(true);
  });

  test('should display the correct header', async ({ page, appPage }) => {
    await appPage.navigate();
    
    // Check header is visible
    expect(await appPage.isHeaderVisible()).toBe(true);
    
    // Check main heading text
    const heading = await appPage.getMainHeading();
    expect(heading).toContain('Jest Testing Demonstration');
    
    // Check sub heading text
    const subHeading = await appPage.getSubHeading();
    expect(subHeading).toContain('React app');
  });

  test('should display all demo sections', async ({ appPage }) => {
    await appPage.navigate();
    
    // Verify all three demo sections are present
    const sectionsCount = await appPage.getDemoSectionsCount();
    expect(sectionsCount).toBe(3);
  });

  test('should display the footer', async ({ appPage }) => {
    await appPage.navigate();
    
    // Check footer is visible
    expect(await appPage.isFooterVisible()).toBe(true);
  });

  test('should have no console errors on load', async ({ page, appPage }) => {
    const consoleErrors = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await appPage.navigate();
    
    // Wait a bit for any delayed errors
    await page.waitForTimeout(1000);
    
    expect(consoleErrors).toHaveLength(0);
  });

  test('should be responsive', async ({ page, appPage }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await appPage.navigate();
    expect(await appPage.isHeaderVisible()).toBe(true);
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    expect(await appPage.isHeaderVisible()).toBe(true);
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    expect(await appPage.isHeaderVisible()).toBe(true);
  });

  test('should have proper accessibility structure', async ({ page, appPage }) => {
    await appPage.navigate();
    
    // Check for main landmark
    const main = await page.locator('main').count();
    expect(main).toBeGreaterThan(0);
    
    // Check for header landmark
    const header = await page.locator('header').count();
    expect(header).toBeGreaterThan(0);
    
    // Check for footer landmark
    const footer = await page.locator('footer').count();
    expect(footer).toBeGreaterThan(0);
    
    // Check for proper heading hierarchy
    const h1 = await page.locator('h1').count();
    expect(h1).toBe(1); // Should have exactly one h1
  });

  test('should load without JavaScript errors', async ({ page, appPage }) => {
    const errors = [];
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    await appPage.navigate();
    await page.waitForTimeout(1000);
    
    expect(errors).toHaveLength(0);
  });
});
