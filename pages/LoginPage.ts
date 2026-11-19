import { Page, Locator } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class LoginPage {
  private readonly page: Page;

  // Locators
  private readonly heading: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.heading = page.getByRole('heading', { name: 'Returning Customer', level: 2 });
    this.emailInput = page.getByRole('textbox', { name: 'E-Mail Address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  /**
   * Verifies that the login page is displayed.
   * @returns Promise<boolean> - true when the login heading is visible
   */
  async isLoginPageExists(): Promise<boolean> {
    await this.heading.waitFor({ state: 'visible' });
    return await this.heading.isVisible();
  }

  /**
   * Logs in with customer credentials.
   * @param email - Customer email address
   * @param password - Customer password
   * @returns Promise<MyAccountPage> - My Account page instance
   */
  async login(email: string, password: string): Promise<MyAccountPage> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    return new MyAccountPage(this.page);
  }
}
