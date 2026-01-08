/**
 * Full User Journey E2E Tests
 * End-to-end tests simulating complete user interactions
 */

import { test, expect } from './fixtures/index.js';
import { mockUsersSuccess } from './utils/apiMock.js';

test.describe('Full User Journey', () => {
  test('complete user interaction flow', async ({
    page,
    appPage,
    counterComponent,
    userListComponent,
  }) => {
    // Mock API for user list
    await mockUsersSuccess(page);

    // Step 1: Navigate to the app
    await appPage.navigate();
    expect(await appPage.isAppLoaded()).toBe(true);

    // Step 2: Verify all sections are visible
    const sectionsCount = await appPage.getDemoSectionsCount();
    expect(sectionsCount).toBe(3);

    // Step 3: Interact with buttons
    let dialogShown = false;
    page.on('dialog', async (dialog) => {
      dialogShown = true;
      expect(dialog.message()).toBe('Button clicked!');
      await dialog.accept();
    });

    const firstButton = await page.locator('.button-demo button').first();
    await firstButton.click();
    expect(dialogShown).toBe(true);

    // Step 4: Interact with counter
    await counterComponent.incrementBy(5);
    expect(await counterComponent.getCount()).toBe(5);

    await counterComponent.decrementBy(2);
    expect(await counterComponent.getCount()).toBe(3);

    await counterComponent.reset();
    expect(await counterComponent.getCount()).toBe(0);

    // Step 5: Verify user list loaded
    await userListComponent.waitForLoadingToFinish();
    await userListComponent.waitForUsers();

    const userCount = await userListComponent.getUserCount();
    expect(userCount).toBeGreaterThan(0);

    // Step 6: Refresh user list
    await userListComponent.refresh();
    await userListComponent.waitForLoadingToFinish();

    // Step 7: Scroll through the page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.evaluate(() => window.scrollTo(0, 0));

    // Step 8: Verify all components maintain their state
    expect(await counterComponent.getCount()).toBe(0);
    expect(await userListComponent.isUserListVisible()).toBe(true);
  });

  test('user explores all components sequentially', async ({
    page,
    appPage,
    counterComponent,
    userListComponent,
  }) => {
    await mockUsersSuccess(page);
    await appPage.navigate();

    // Explore buttons section
    const buttonSection = await page.locator('.demo-section').first();
    await buttonSection.scrollIntoViewIfNeeded();

    const buttons = await page.locator('.button-demo button').all();
    expect(buttons.length).toBeGreaterThanOrEqual(4);

    // Explore counter section
    const counterSection = await page.locator('.demo-section').nth(1);
    await counterSection.scrollIntoViewIfNeeded();

    // Test counter functionality
    await counterComponent.incrementBy(10);
    expect(await counterComponent.isIncrementDisabled()).toBe(true);

    await counterComponent.decrementBy(5);
    expect(await counterComponent.getCount()).toBe(5);

    // Explore user list section
    const userListSection = await page.locator('.demo-section').nth(2);
    await userListSection.scrollIntoViewIfNeeded();

    await userListComponent.waitForUsers();
    expect(await userListComponent.getUserCount()).toBeGreaterThan(0);
  });

  test('responsive behavior across viewport sizes', async ({
    page,
    appPage,
  }) => {
    await mockUsersSuccess(page);

    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await appPage.navigate();
    expect(await appPage.isHeaderVisible()).toBe(true);
    expect(await appPage.getDemoSectionsCount()).toBe(3);

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    expect(await appPage.isHeaderVisible()).toBe(true);
    expect(await appPage.getDemoSectionsCount()).toBe(3);

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    expect(await appPage.isHeaderVisible()).toBe(true);
    expect(await appPage.getDemoSectionsCount()).toBe(3);
  });

  test('keyboard navigation flow', async ({
    page,
    appPage,
    counterComponent,
  }) => {
    await mockUsersSuccess(page);
    await appPage.navigate();

    // Tab through interactive elements
    await page.keyboard.press('Tab'); // First button
    await page.keyboard.press('Tab'); // Second button
    await page.keyboard.press('Tab'); // Third button
    await page.keyboard.press('Tab'); // Fourth button (disabled)
    await page.keyboard.press('Tab'); // Decrement button

    // Press Enter on decrement (should be disabled at 0)
    await page.keyboard.press('Enter');
    expect(await counterComponent.getCount()).toBe(0);

    // Tab to increment button
    await page.keyboard.press('Tab'); // Reset button
    await page.keyboard.press('Tab'); // Increment button

    // Press Enter to increment
    await page.keyboard.press('Enter');
    expect(await counterComponent.getCount()).toBe(1);
  });

  test('error recovery flow', async ({ page, appPage, userListComponent }) => {
    let requestCount = 0;

    // First request fails, subsequent succeed
    await page.route('**/api/users*', async (route) => {
      requestCount++;
      if (requestCount === 1) {
        await route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Server error' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          body: JSON.stringify([
            { id: 1, name: 'John Doe', email: 'john@example.com' },
          ]),
        });
      }
    });

    await appPage.navigate();

    // Wait for error
    await userListComponent.waitForError();
    expect(await userListComponent.isError()).toBe(true);

    // Retry
    await userListComponent.retry();

    // Wait for success
    await userListComponent.waitForLoadingToFinish();
    await userListComponent.waitForUsers();

    expect(await userListComponent.getUserCount()).toBeGreaterThan(0);
  });

  test('multiple component interactions in parallel', async ({
    page,
    appPage,
    counterComponent,
    userListComponent,
  }) => {
    await mockUsersSuccess(page);
    await appPage.navigate();

    // Interact with counter while users are loading
    await counterComponent.incrementBy(3);

    // Wait for users to finish loading
    await userListComponent.waitForLoadingToFinish();
    await userListComponent.waitForUsers();

    // Continue interacting with counter
    await counterComponent.incrementBy(2);
    expect(await counterComponent.getCount()).toBe(5);

    // Refresh users
    await userListComponent.refresh();

    // Continue interacting with counter during refresh
    await counterComponent.incrementBy(3);
    expect(await counterComponent.getCount()).toBe(8);

    // Wait for refresh to complete
    await userListComponent.waitForLoadingToFinish();

    // All components should maintain their state
    expect(await counterComponent.getCount()).toBe(8);
    expect(await userListComponent.isUserListVisible()).toBe(true);
  });

  test('page reload maintains URL but resets state', async ({
    page,
    appPage,
    counterComponent,
  }) => {
    await mockUsersSuccess(page);
    await appPage.navigate();

    // Change counter state
    await counterComponent.incrementBy(5);
    expect(await counterComponent.getCount()).toBe(5);

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // URL should be the same
    await expect(page).toHaveURL('/');

    // State should reset
    expect(await counterComponent.getCount()).toBe(0);
  });

  test('handling rapid user interactions', async ({
    counterComponent,
    page,
  }) => {
    await mockUsersSuccess(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Rapidly click increment
    for (let i = 0; i < 10; i++) {
      await counterComponent.increment();
    }

    // Counter should handle all clicks (max is 10)
    expect(await counterComponent.getCount()).toBe(10);

    // Rapidly click decrement
    for (let i = 0; i < 15; i++) {
      await counterComponent.decrement();
    }

    // Counter should not go below 0
    expect(await counterComponent.getCount()).toBe(0);
  });

  test('complete accessibility check', async ({ page, appPage }) => {
    await mockUsersSuccess(page);
    await appPage.navigate();

    // Check page structure
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    // Check landmarks
    expect(await page.locator('header').count()).toBeGreaterThan(0);
    expect(await page.locator('main').count()).toBeGreaterThan(0);
    expect(await page.locator('footer').count()).toBeGreaterThan(0);

    // Check interactive elements are keyboard accessible
    const buttons = await page.locator('button').all();
    for (const button of buttons.slice(0, 3)) {
      await button.focus();
      const isFocused = await button.evaluate(
        (el) => el === document.activeElement
      );
      expect(isFocused).toBe(true);
    }
  });

  test('performance check - page loads within acceptable time', async ({
    page,
    appPage,
  }) => {
    await mockUsersSuccess(page);

    const startTime = Date.now();
    await appPage.navigate();
    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);

    // All sections should be visible
    expect(await appPage.getDemoSectionsCount()).toBe(3);
  });
});
