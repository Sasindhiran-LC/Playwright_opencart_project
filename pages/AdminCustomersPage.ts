import { Page, Locator } from '@playwright/test';

export class AdminCustomersPage {
  private readonly page: Page;

  // Locators
  private readonly heading: Locator;
  private readonly filterEmailInput: Locator;
  private readonly filterButton: Locator;
  private readonly customerRows: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.heading = page.getByRole('heading', { name: 'Customers', level: 1 });
    this.filterEmailInput = page.getByRole('textbox', { name: 'E-Mail' });
    this.filterButton = page.getByRole('button', { name: 'Filter' });
    this.customerRows = page.locator('table.table tbody tr');
  }

  /**
   * Verifies that the admin customers page is displayed.
   * @returns Promise<boolean> - true when the customers heading is visible
   */
  async isAdminCustomersPageExists(): Promise<boolean> {
    await this.heading.waitFor({ state: 'visible' });
    return await this.heading.isVisible();
  }

  /**
   * Searches for a customer by email.
   * @param email - Customer email to search for
   */
  async searchCustomerByEmail(email: string): Promise<void> {
    await this.filterEmailInput.fill(email);
    await this.filterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verifies that a customer with the given email exists in the results.
   * @param email - Customer email to verify
   * @returns Promise<boolean> - true when customer is found
   */
  async isCustomerFound(email: string): Promise<boolean> {
    return await this.customerRows.filter({ hasText: email }).count() === 1;
  }

  /**
   * Opens the customer record and reads its details.
   * @param email - Customer email to get details for
   * @returns Promise<{firstName: string, lastName: string, email: string, status: string} | null> - Customer details or null if not found
   */
  async getCustomerDetails(email: string): Promise<{firstName: string, lastName: string, email: string, status: string} | null> {
    const row = this.customerRows.filter({ hasText: email });
    if (await row.count() !== 1) {
      return null;
    }

    await row.locator('a[title="Edit"]').click();

    const firstName = await this.page.getByRole('textbox', { name: 'First Name' }).inputValue();
    const lastName = await this.page.getByRole('textbox', { name: 'Last Name' }).inputValue();
    const customerEmail = await this.page.getByRole('textbox', { name: 'E-Mail' }).inputValue();
    const status = await this.page.locator('#input-status').isChecked() ? 'Enabled' : 'Disabled';

    return { firstName, lastName, email: customerEmail, status };
  }
}