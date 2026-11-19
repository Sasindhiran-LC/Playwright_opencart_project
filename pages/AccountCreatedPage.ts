import { Page, Locator } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class AccountCreatedPage {
  private readonly page: Page;

  // Locators
  private readonly heading: Locator;
  private readonly myAccountLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.heading = page.getByRole('heading', { name: 'Your Account Has Been Created!', level: 1 });
    this.myAccountLink = page.getByRole('link', { name: 'My Account', exact: true }).first();
  }

  /**
   * Verifies that account creation succeeded.
   * @returns Promise<boolean> - true when the confirmation heading is visible
   */
  async isAccountCreatedExists(): Promise<boolean> {
    await this.heading.waitFor({ state: 'visible' });
    return await this.heading.isVisible();
  }

  /**
   * Opens the authenticated My Account area.
   * @returns Promise<MyAccountPage> - My Account page instance
   */
  async clickMyAccount(): Promise<MyAccountPage> {
    await this.myAccountLink.click();
    return new MyAccountPage(this.page);
  }
}
