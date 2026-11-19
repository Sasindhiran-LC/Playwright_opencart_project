/**
 * Test Case: Valid customer login
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to the login page
 * 2) Submit configured valid credentials
 * 3) Verify the My Account dashboard
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('Valid customer login test @master @sanity @regression @web @e2e', async ({ homePage }) => {
  const email = `login-${Date.now()}-${RandomDataUtil.getEmail()}`;
  const password = RandomDataUtil.getPassword(12);

  await test.step('1) Create a customer account for login', async () => {
    await homePage.clickMyAccount();
    const registerPage = await homePage.clickRegister();
    const accountCreatedPage = await registerPage.completeRegistration(
      RandomDataUtil.getFirstName(),
      RandomDataUtil.getLastName(),
      email,
      password,
      RandomDataUtil.getPhoneNumber()
    );
    expect(await accountCreatedPage.isAccountCreatedExists()).toBeTruthy();
  });

  await test.step('2) Log out of the customer account', async () => {
    await homePage.clickMyAccount();
    await homePage.clickLogout();
  });

  await test.step('3) Navigate to and submit the login form', async () => {
    await homePage.clickMyAccount();
    const loginPage = await homePage.clickLogin();
    expect(await loginPage.isLoginPageExists()).toBeTruthy();

    await test.step('Submit valid credentials', async () => {
      const myAccountPage = await loginPage.login(email, password);
      expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
    });
  });

  console.log('✅ Valid customer login completed successfully');
});
