/**
 * Test Case: Customer registration
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to the registration page
 * 2) Complete registration with unique customer data
 * 3) Verify account creation and My Account navigation
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('Customer registration test @master @sanity @regression @web', async ({homePage}) => {
  const firstName = RandomDataUtil.getFirstName();
  const lastName = RandomDataUtil.getLastName();
  const email = `registration-${Date.now()}-${RandomDataUtil.getEmail()}`.toLowerCase();
  const password = RandomDataUtil.getPassword(12);
  const telephone = RandomDataUtil.getPhoneNumber();

  const registerPage = await test.step('1) Navigate to the registration page', async () => {
    await homePage.clickMyAccount();
    const register = await homePage.clickRegister();
    expect(await register.isRegisterPageExists()).toBeTruthy();
    return register;
  });

  const accountCreatedPage = await test.step('2) Complete customer registration', async () => {
    return await registerPage.completeRegistration(
      firstName,
      lastName,
      email,
      password,
      telephone
    );
  });

  await test.step('3) Verify account creation and My Account navigation', async () => {
    expect(await accountCreatedPage.isAccountCreatedExists()).toBeTruthy();
    const myAccountPage = await accountCreatedPage.clickMyAccount();
    expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
  });

  console.log('✅ Customer registration completed successfully');
});



// ========the exact same test without using test.step()================

/*
test('Customer registration test @master @sanity @regression @web', async ({ homePage }) => {

    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = `registration-${Date.now()}-${RandomDataUtil.getEmail()}`.toLowerCase();
    const password = RandomDataUtil.getPassword(12);
    const telephone = RandomDataUtil.getPhoneNumber();

    // Step 1: Navigate to registration page
    await homePage.clickMyAccount();
    const registerPage = await homePage.clickRegister();
    expect(await registerPage.isRegisterPageExists()).toBeTruthy();

    // Step 2: Complete customer registration
    const accountCreatedPage = await registerPage.completeRegistration(
        firstName,
        lastName,
        email,
        password,
        telephone
    );

    // Step 3: Verify account creation and My Account navigation
    expect(await accountCreatedPage.isAccountCreatedExists()).toBeTruthy();

    const myAccountPage = await accountCreatedPage.clickMyAccount();
    expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();

    console.log('Customer registration completed successfully');
});
*/