import { Page, Locator } from '@playwright/test';
import { AccountCreatedPage } from './AccountCreatedPage';

export class RegisterPage {
  private readonly page: Page;

  // Locators
  private readonly heading: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly telephoneInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly privacyPolicyCheckbox: Locator;
  private readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.heading = page.getByRole('heading', { name: 'Register Account', level: 1 });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.emailInput = page.getByRole('textbox', { name: 'E-Mail' });
    this.telephoneInput = page.getByRole('textbox', { name: 'Telephone' });
    this.passwordInput = page.getByLabel('Password', { exact: true });
    this.confirmPasswordInput = page.getByLabel('Password Confirm', { exact: true });
    this.privacyPolicyCheckbox = page.locator('input[name="agree"]');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  /**
   * Verifies that the registration page is displayed.
   * @returns Promise<boolean> - true when the page heading is visible
   */
  async isRegisterPageExists(): Promise<boolean> {
    await this.heading.waitFor({ state: 'visible' });
    return await this.heading.isVisible();
  }

  /**
   * Completes customer registration.
   * @param firstName - Customer first name
   * @param lastName - Customer last name
   * @param email - Customer email address
   * @param password - Customer password
   * @returns Promise<AccountCreatedPage> - Account created page instance
   */
  async completeRegistration(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    telephone: string
  ): Promise<AccountCreatedPage> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.telephoneInput.fill(telephone);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.privacyPolicyCheckbox.check();
    await this.continueButton.click();
    return new AccountCreatedPage(this.page);
  }
}
