import { test as base } from '@playwright/test';
import dotenv from 'dotenv';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminCustomersPage } from '../pages/AdminCustomersPage';

dotenv.config();

const APP_URL = process.env.WEB_APP_URL;
const ADMIN_URL = process.env.ADMIN_APP_URL || 'http://localhost/opencart/upload/admin/index.php';

type PageFixtures = {
  homePage: HomePage;
  registerPage: RegisterPage;
  loginPage: LoginPage;
  accountCreatedPage: AccountCreatedPage;
  myAccountPage: MyAccountPage;
  adminLoginPage: AdminLoginPage;
  adminDashboardPage: AdminDashboardPage;
  adminCustomersPage: AdminCustomersPage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await page.goto(APP_URL || 'http://localhost/opencart/upload/');
    await use(new HomePage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountCreatedPage: async ({ page }, use) => {
    await use(new AccountCreatedPage(page));
  },
  myAccountPage: async ({ page }, use) => {
    await use(new MyAccountPage(page));
  },
  adminLoginPage: async ({ page }, use) => {
    await page.goto(ADMIN_URL);
    await use(new AdminLoginPage(page));
  },
  adminDashboardPage: async ({ page }, use) => {
    await use(new AdminDashboardPage(page));
  },
  adminCustomersPage: async ({ page }, use) => {
    await use(new AdminCustomersPage(page));
  },
});

test.afterEach(async ({ page, context }) => {
  if (!page.isClosed()) {
    await page.close();
  }
  await context.close();
});

export { expect } from '@playwright/test';
