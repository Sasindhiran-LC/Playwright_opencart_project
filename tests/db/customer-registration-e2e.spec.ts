/**
 * Test Case: End-to-End Customer Registration Validation (Frontend + Admin + Database)
 *
 * Tags: @master @sanity @regression @end-to-end @db
 *
 * Steps:
 * 1) Register a customer through the frontend
 * 2) Verify the customer in the Admin Portal
 * 3) Verify the customer in MySQL database
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { HomePage } from '../../pages/HomePage';
import { RegisterPage } from '../../pages/RegisterPage';
import { AccountCreatedPage } from '../../pages/AccountCreatedPage';
import { AdminLoginPage } from '../../pages/AdminLoginPage';
import { AdminDashboardPage } from '../../pages/AdminDashboardPage';
import { AdminCustomersPage } from '../../pages/AdminCustomersPage';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { executeQuery } from '../../utils/dbClient';
import dotenv from 'dotenv';
import type { RowDataPacket } from 'mysql2/promise';

dotenv.config();

const APP_URL = process.env.WEB_APP_URL || 'http://localhost/opencart/upload/';
const ADMIN_URL = process.env.ADMIN_APP_URL || 'http://localhost/opencart/upload/admin/index.php';

interface CustomerRow extends RowDataPacket {
  customer_id: number;
  firstname: string;
  lastname: string;
  email: string;
  status: number;
  date_added: Date | string;
}

test('End-to-End Customer Registration Validation @master @sanity @regression @end-to-end @db', async ({ page }) => {
  // Generate unique customer data
  const firstName = RandomDataUtil.getFirstName();
  const lastName = RandomDataUtil.getLastName();
  const email = `test-${Date.now()}-${RandomDataUtil.getEmail()}`.toLowerCase();
  const password = RandomDataUtil.getPassword(12);
  const telephone = RandomDataUtil.getPhoneNumber();

  // Create page objects
  const homePage = new HomePage(page);
  const registerPage = new RegisterPage(page);
  const accountCreatedPage = new AccountCreatedPage(page);
  const adminLoginPage = new AdminLoginPage(page);
  const adminDashboardPage = new AdminDashboardPage(page);
  const adminCustomersPage = new AdminCustomersPage(page);

  // ============================================================
  // Step 1: Register Customer Through Frontend
  // ============================================================
  await test.step('1) Register customer through frontend', async () => {
    await page.goto(APP_URL);
    await homePage.clickMyAccount();
    await homePage.clickRegister();
    expect(await registerPage.isRegisterPageExists()).toBeTruthy();

    await registerPage.completeRegistration(firstName, lastName, email, password, telephone);

    expect(await accountCreatedPage.isAccountCreatedExists()).toBeTruthy();
    console.log(`✅ Customer registered: ${firstName} ${lastName} (${email})`);
  });

  // ============================================================
  // Step 2: Verify Customer in Admin Portal
  // ============================================================
  await test.step('2) Verify customer in Admin Portal', async () => {
    // Navigate to admin portal
    await page.goto(ADMIN_URL);
    
    // Login to admin
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    
    expect(await adminLoginPage.isAdminLoginPageExists()).toBeTruthy();
    await adminLoginPage.login(adminUsername, adminPassword);

    // Navigate to customers
    await adminDashboardPage.navigateToCustomers();
    expect(await adminCustomersPage.isAdminCustomersPageExists()).toBeTruthy();

    // Search for customer
    await adminCustomersPage.searchCustomerByEmail(email);
    
    // Verify customer exists
    const isFound = await adminCustomersPage.isCustomerFound(email);
    expect(isFound).toBeTruthy();

    // Get and verify customer details
    const customerDetails = await adminCustomersPage.getCustomerDetails(email);
    expect(customerDetails).not.toBeNull();
    expect(customerDetails?.firstName, 'Admin first name does not match registered customer').toBe(firstName);
    expect(customerDetails?.lastName, 'Admin last name does not match registered customer').toBe(lastName);
    expect(customerDetails?.email, 'Admin email does not match registered customer').toBe(email);
    expect(customerDetails?.status, 'New customer should be enabled in the Admin Portal').toBe('Enabled');

    console.log(`✅ Customer verified in Admin Portal: ${customerDetails?.firstName} ${customerDetails?.lastName} (${customerDetails?.email}) - Status: ${customerDetails?.status}`);
  });

  // ============================================================
  // Step 3: Verify Customer in MySQL Database
  // ============================================================
  await test.step('3) Verify customer in MySQL database', async () => {
    // Query the oc_customer table
    const query = `
      SELECT customer_id, firstname, lastname, email, telephone, status, date_added
      FROM oc_customer
      WHERE email = ?
    `;
    
    const [resultRows] = await executeQuery(query, [email]);
    const rows = resultRows as CustomerRow[];
    
    // Verify exactly one record found
    expect(rows, 'Expected exactly one matching database customer record').toHaveLength(1);
    
    const customer = rows[0];
    
    // Validate customer data
    expect(customer.firstname, 'Database first name does not match registered customer').toBe(firstName);
    expect(customer.lastname, 'Database last name does not match registered customer').toBe(lastName);
    expect(customer.email, 'Database email does not match registered customer').toBe(email);
    expect(customer.status, 'Database status should be enabled (1)').toBe(1);
    expect(customer.date_added, 'Database date_added should be present').toBeTruthy();
    
    console.log(`✅ Customer verified in Database: ID=${customer.customer_id}, ${customer.firstname} ${customer.lastname} (${customer.email}) - Status=${customer.status} - Date Added=${customer.date_added}`);
  });

  console.log('✅ End-to-End Customer Registration Validation completed successfully!');
});