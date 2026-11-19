import { Page, Locator } from '@playwright/test';

export class MyAccountPage {
  // Locators
  private readonly heading: Locator;
  private readonly editAccountLink: Locator;

  constructor(page: Page) {
    // Initialize locators with CSS selectors
    this.heading = page.locator('#content').getByRole('heading', { name: 'My Account' });
    this.editAccountLink = page.locator('#content').getByRole('link', { name: 'Edit your account information', exact: true });
  }

  /**
   * Verifies that the authenticated My Account page is displayed.
   * @returns Promise<boolean> - true when account dashboard controls are visible
   */
  async isMyAccountPageExists(): Promise<boolean> {
    await this.heading.waitFor({ state: 'visible' });
    await this.editAccountLink.waitFor({ state: 'visible' });
    return await this.heading.isVisible() && await this.editAccountLink.isVisible();
  }
}
