import { Page, Locator } from '@playwright/test';
import { AdminCustomersPage } from './AdminCustomersPage';

export class AdminDashboardPage {
  private readonly page: Page;

  // Locators
  private readonly customersMenu: Locator;
  private readonly securityModal: Locator;
  private readonly securityModalCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.customersMenu = page.getByRole('link', { name: /^Customers/ });
    this.securityModal = page.locator('#modal-security');
    this.securityModalCloseButton = this.securityModal.locator('button.btn-close');
  }

  /**
   * Navigates to the Customers section.
   * @returns Promise<AdminCustomersPage> - Admin customers page instance
   */
  async navigateToCustomers(): Promise<AdminCustomersPage> {
     if (await this.securityModal.isVisible()) {
       await this.securityModalCloseButton.click();
     }

    await this.customersMenu.click();
     await this.page.getByRole('link', { name: 'Customers', exact: true }).click();
    return new AdminCustomersPage(this.page);
  }
}