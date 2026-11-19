import { Page, Locator } from '@playwright/test';
import { RegisterPage } from './RegisterPage';
import { LoginPage } from './LoginPage';

export class HomePage {
  private readonly page: Page;

  // Locators
  private readonly myAccountLink: Locator;
  private readonly registerLink: Locator;
  private readonly loginLink: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.myAccountLink = page.locator('a[href*="route=account/account"]').first();
    this.registerLink = page.getByRole('link', { name: 'Register', exact: true }).first();
    this.loginLink = page.getByRole('link', { name: 'Login', exact: true }).first();
    this.logoutLink = page.getByRole('link', { name: 'Logout', exact: true }).first();
  }

  /**
   * Opens the My Account menu.
   */
  async clickMyAccount(): Promise<void> {
    await this.myAccountLink.click() 
  }

  /**
   * Opens the registration page.
   * @returns Promise<RegisterPage> - Registration page instance
   */
  async clickRegister(): Promise<RegisterPage> {
    await this.registerLink.click();
    return new RegisterPage(this.page);
  }

  /**
   * Opens the login page.
   * @returns Promise<LoginPage> - Login page instance
   */
  async clickLogin(): Promise<LoginPage> {
    await this.loginLink.click();
    return new LoginPage(this.page);
  }

  /**
   * Logs out and opens the login page.
   * @returns Promise<LoginPage> - Login page instance
   */
  async clickLogout(): Promise<LoginPage> {
    await this.logoutLink.click();
    return new LoginPage(this.page);
  }
}
