import { Page, Locator } from '@playwright/test';
import { AdminDashboardPage } from './AdminDashboardPage';

export class AdminLoginPage {
  private readonly page: Page;

  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.heading = page.getByText('Please enter your login details');
  }

  /**
   * Verifies that the admin login page is displayed.
   * @returns Promise<boolean> - true when the login heading is visible
   */
  async isAdminLoginPageExists(): Promise<boolean> {
    await this.heading.waitFor({ state: 'visible' });
    return await this.heading.isVisible();
  }

  /**
   * Logs in to the admin portal.
   * @param username - Admin username
   * @param password - Admin password
   * @returns Promise<AdminDashboardPage> - Admin dashboard page instance
   */
  async login(username: string, password: string): Promise<AdminDashboardPage> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    return new AdminDashboardPage(this.page);
  }
}