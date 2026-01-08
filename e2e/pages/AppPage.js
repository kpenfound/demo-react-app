/**
 * App Page Object
 * Represents the main application page
 */

import { BasePage } from './BasePage.js';

export class AppPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectors
    this.selectors = {
      header: '.App-header',
      mainHeading: '.App-header h1',
      subHeading: '.App-header p',
      footer: '.App-footer',
      demoSections: '.demo-section',
    };
  }

  /**
   * Navigate to the app
   */
  async navigate() {
    await this.goto('/');
    await this.waitForLoad();
  }

  /**
   * Get the main heading text
   */
  async getMainHeading() {
    return await this.page.textContent(this.selectors.mainHeading);
  }

  /**
   * Get the sub heading text
   */
  async getSubHeading() {
    return await this.page.textContent(this.selectors.subHeading);
  }

  /**
   * Check if header is visible
   */
  async isHeaderVisible() {
    return await this.isVisible(this.selectors.header);
  }

  /**
   * Check if footer is visible
   */
  async isFooterVisible() {
    return await this.isVisible(this.selectors.footer);
  }

  /**
   * Get all demo sections
   */
  async getDemoSections() {
    return await this.page.$$(this.selectors.demoSections);
  }

  /**
   * Get the count of demo sections
   */
  async getDemoSectionsCount() {
    const sections = await this.getDemoSections();
    return sections.length;
  }

  /**
   * Check if the app is fully loaded
   */
  async isAppLoaded() {
    await this.waitForSelector(this.selectors.header);
    await this.waitForSelector(this.selectors.footer);
    return true;
  }
}
