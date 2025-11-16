import { expect, test } from '@playwright/test';

test.describe('Accessibility', () => {
	test('should have proper heading structure', async ({ page }) => {
		await page.goto('/');
		const h1 = page.locator('h1').first();
		await expect(h1).toBeVisible();
	});
});
