/**
 * Custom Playwright Fixtures
 * Provides reusable test fixtures with page objects
 */

import { test as base } from '@playwright/test';
import { AppPage } from '../pages/AppPage.js';
import { ButtonComponent } from '../pages/ButtonComponent.js';
import { CounterComponent } from '../pages/CounterComponent.js';
import { UserListComponent } from '../pages/UserListComponent.js';

/**
 * Extended test with custom fixtures
 */
export const test = base.extend({
  /**
   * App page fixture
   */
  appPage: async ({ page }, use) => {
    const appPage = new AppPage(page);
    await use(appPage);
  },

  /**
   * Button component fixture
   */
  buttonComponent: async ({ page }, use) => {
    const buttonComponent = new ButtonComponent(page);
    await use(buttonComponent);
  },

  /**
   * Counter component fixture
   */
  counterComponent: async ({ page }, use) => {
    const counterComponent = new CounterComponent(page);
    await use(counterComponent);
  },

  /**
   * UserList component fixture
   */
  userListComponent: async ({ page }, use) => {
    const userListComponent = new UserListComponent(page);
    await use(userListComponent);
  },

  /**
   * Fixture that navigates to the app before each test
   */
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await use(page);
  },
});

export { expect } from '@playwright/test';
