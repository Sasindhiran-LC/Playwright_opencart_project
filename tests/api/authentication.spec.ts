import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';

dotenv.config({ override: true });

test.describe('Authentication API Tests', () => {
  const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  const USERNAME = process.env.USERNAME || 'mor_2314';
  const PASSWORD = process.env.PASSWORD || '83r5^_';

  test('POST - Successful login @master @sanity @api', async ({ request }) => {
    const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
      data: {
        username: USERNAME,
        password: PASSWORD,
      },
    });


    expect(response.status(), 'Successful login status should be 201').toBe(201);

    const responseBody = await response.json();
    console.log(responseBody)

    expect(typeof responseBody.token, 'Login response token should exist').toBe('string');
    expect(responseBody.token.length, 'Login token should not be empty').toBeGreaterThan(0);
  });

  test('POST - Invalid login @master @regression @api', async ({ request }) => {
    const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
      data: {
        username: 'invalid-user',
        password: 'invalid-password',
      },
    });

    expect(response.status(), 'Invalid login status should be 401').toBe(401);

    const responseBody = await response.text();

    expect(responseBody, 'Invalid login should return the authentication error message').toBe(
      'username or password is incorrect'
    );
  });
});
