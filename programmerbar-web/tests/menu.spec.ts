import { expect, test } from '@playwright/test';

test.describe('Menu Page', () => {
	test('should load menu page', async ({ page }) => {
		await page.goto('/meny');
		await expect(page).toHaveURL(/.*meny/);
	});

	test('should display products', async ({ page }) => {
		await page.goto('/meny');
		// Wait for products to load
		const productList = page.locator('[class*="product"], [class*="card"]').first();
		await expect(productList).toBeVisible({ timeout: 10000 });
	});
});

