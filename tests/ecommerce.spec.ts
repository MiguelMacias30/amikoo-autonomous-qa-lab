
import { test, expect } from '@playwright/test';

test.describe('Automation Exercise - QA Lab', () => {

  test('QA-001: Homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Automation Exercise/i);
    await expect(
      page.getByRole('link', { name: 'Products' }).first()
    ).toBeVisible();
  });

  test('QA-002: Products catalog is accessible', async ({ page }) => {
    await page.goto('/products');

    await expect(
      page.getByText('All Products', { exact: false }).first()
    ).toBeVisible();
  });

  test('QA-003: Search returns matching products', async ({ page }) => {
    await page.goto('/products');

    await page.locator('#search_product').fill('Blue Top');
    await page.locator('#submit_search').click();

    await expect(
      page.getByText('Searched Products')
    ).toBeVisible();

    await expect(
      page.getByText('Blue Top', { exact: true }).first()
    ).toBeVisible();
  });

  test('QA-004: Login rejects invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.locator('[data-qa="login-email"]')
      .fill('invalid@example.com');

    await page.locator('[data-qa="login-password"]')
      .fill('invalid-password');

    await page.locator('[data-qa="login-button"]').click();

    await expect(
      page.getByText('Your email or password is incorrect!')
    ).toBeVisible();
  });

});
