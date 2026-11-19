import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';

dotenv.config();

test.describe('Products API Tests', () => {
  const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
  const LIMIT = Number(process.env.LIMIT ?? 3);

  test('GET - All products @master @sanity @api', async ({ request }) => {
    const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);

    expect(response.status(), 'Get all products status should be 200').toBe(200);

    const responseBody = await response.json();

    expect(Array.isArray(responseBody), 'Get all products should return an array').toBeTruthy();
    expect(responseBody.length, 'Get all products should return at least one product').toBeGreaterThan(0);

    responseBody.forEach((product: unknown, index: number) => {
      expect(typeof product, `Product ${index + 1} should be an object`).toBe('object');

      const item = product as {
        id?: unknown;
        title?: unknown;
        price?: unknown;
        category?: unknown;
        image?: unknown;
      };

      expect(typeof item.id, `Product ${index + 1} id should be a number`).toBe('number');
      expect(typeof item.title, `Product ${index + 1} title should be a string`).toBe('string');
      expect(typeof item.price, `Product ${index + 1} price should be a number`).toBe('number');
      expect(typeof item.category, `Product ${index + 1} category should be a string`).toBe('string');
      expect(typeof item.image, `Product ${index + 1} image should be a string`).toBe('string');
    });
  });

  test('GET - Product by ID @master @sanity @api', async ({ request }) => {
    const route = Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID));
    const response = await request.get(`${BASE_URL}${route}`);

    expect(response.status(), `Get product ${PRODUCT_ID} status should be 200`).toBe(200);

    const product = await response.json();

    expect(product.id, 'Returned product id should match the requested id').toBe(PRODUCT_ID);
    expect(typeof product.title, 'Returned product title should be a string').toBe('string');
    expect(typeof product.price, 'Returned product price should be a number').toBe('number');
    expect(typeof product.category, 'Returned product category should be a string').toBe('string');
    expect(typeof product.image, 'Returned product image should be a string').toBe('string');
  });

  test('GET - Products with limit @master @sanity @api', async ({ request }) => {
    const route = Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT));
    const response = await request.get(`${BASE_URL}${route}`);

    expect(response.status(), `Get products with limit ${LIMIT} status should be 200`).toBe(200);

    const responseBody = await response.json();

    expect(Array.isArray(responseBody), 'Limited products response should be an array').toBeTruthy();
    expect(responseBody.length, `Limited products count should equal ${LIMIT}`).toBe(LIMIT);
  });
});
