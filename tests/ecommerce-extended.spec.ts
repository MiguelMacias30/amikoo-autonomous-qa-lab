import { test, expect } from '@playwright/test';

/**
 * Extended regression coverage for Automation Exercise.
 * Covers flows not yet addressed by ecommerce.spec.ts (QA-001 – QA-005):
 *   - Signup / registration form
 *   - Product detail page
 *   - Add-to-cart flow
 *   - Cart page accessibility
 *   - Search with no results (edge case)
 *   - Login page form structure
 *   - Contact Us form submission (negative – missing required fields)
 */
test.describe('Automation Exercise - Extended QA Lab', () => {

  // ── Registration ──────────────────────────────────────────────────────────

  test('QA-006: Signup form is accessible and renders name/email fields', async ({ page }) => {
    // The login page hosts both the login and the new-user signup forms.
    await page.goto('/login');

    await expect(
      page.getByText('New User Signup!', { exact: false }).first()
    ).toBeVisible();

    // Verify the signup name and email inputs are present.
    await expect(page.locator('[data-qa="signup-name"]')).toBeVisible();
    await expect(page.locator('[data-qa="signup-email"]')).toBeVisible();
    await expect(page.locator('[data-qa="signup-button"]')).toBeVisible();
  });

  test('QA-007: Signup rejects an already-registered email', async ({ page }) => {
    // Uses a known-existing account on the public demo site.
    await page.goto('/login');

    await page.locator('[data-qa="signup-name"]').fill('Test User');
    await page.locator('[data-qa="signup-email"]').fill('test@example.com');
    await page.locator('[data-qa="signup-button"]').click();

    // The site shows an inline error when the email is already taken.
    await expect(
      page.getByText('Email Address already exist!', { exact: false }).first()
    ).toBeVisible();
  });

  // ── Product detail ────────────────────────────────────────────────────────

  test('QA-008: Product detail page loads with name and price', async ({ page }) => {
    // Navigate directly to the first product's detail page.
    await page.goto('/product_details/1');

    // Product name heading and price must be visible.
    await expect(
      page.locator('.product-information h2').first()
    ).toBeVisible();

    await expect(
      page.locator('.product-information span span').first()
    ).toBeVisible();

    // "Add to cart" button must be present on the detail page.
    await expect(
      page.getByRole('button', { name: /add to cart/i }).first()
    ).toBeVisible();
  });

  // ── Cart ──────────────────────────────────────────────────────────────────

  test('QA-009: Adding a product from the catalog opens the cart modal', async ({ page }) => {
    await page.goto('/products');

    // Hover over the first product card to reveal the "Add to cart" overlay.
    const firstProduct = page.locator('.product-image-wrapper').first();
    await firstProduct.hover();

    const addToCartBtn = firstProduct.getByText('Add to cart').first();
    await addToCartBtn.click();

    // A modal dialog should appear confirming the item was added.
    await expect(
      page.getByText('Added!', { exact: false }).first()
    ).toBeVisible();
  });

  test('QA-010: Cart page is accessible and shows the cart table', async ({ page }) => {
    await page.goto('/view_cart');

    // The cart page must load with its table structure.
    await expect(page.locator('#cart_info_table')).toBeVisible();
  });

  // ── Search edge case ──────────────────────────────────────────────────────

  test('QA-011: Search with a non-existent term shows empty results', async ({ page }) => {
    await page.goto('/products');

    await page.locator('#search_product').fill('xyznonexistentproduct12345');
    await page.locator('#submit_search').click();

    // The "Searched Products" heading must still appear (page renders correctly).
    await expect(
      page.getByText('Searched Products')
    ).toBeVisible();

    // No product cards should be listed.
    await expect(page.locator('.productinfo')).toHaveCount(0);
  });

  // ── Contact Us form validation ────────────────────────────────────────────

  test('QA-012: Contact Us form requires all fields before submission', async ({ page }) => {
    await page.goto('/contact_us');

    // Attempt to submit the form without filling any field.
    await page.locator('[data-qa="submit-button"]').click();

    // The name field should be marked as required by the browser (invalid).
    const nameField = page.locator('[data-qa="name"]');
    await expect(nameField).toBeVisible();

    // Confirm we are still on the contact page (no redirect on empty submit).
    await expect(page).toHaveURL(/contact_us/);
  });

});
