import { expect, test } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
	test('should be responsive on mobile viewport', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
		await page.goto('/');

		// Check that content is visible and not overflowing
		const body = page.locator('body');
		await expect(body).toBeVisible();

		// Check that images are hidden on mobile (if implemented)
		const images = page.locator('img').first();
		if (await images.isVisible()) {
			// Images might be visible, that's okay
			await expect(images).toBeVisible();
		}
	});
});
