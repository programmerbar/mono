import { expect, test } from '@playwright/test';

test.describe('Authentication', () => {
	test('should redirect to login when accessing protected route', async ({ page }) => {
		await page.goto('/portal');
		// Should redirect to login page
		await expect(page).toHaveURL(/.*logg-inn/);
	});

	test('login page should be accessible', async ({ page }) => {
		await page.goto('/logg-inn');
		await expect(page).toHaveURL(/.*logg-inn/);

		// Check for login elements
		const loginButton = page.locator('button, a').filter({ hasText: /logg inn|login/i });
		await expect(loginButton.first()).toBeVisible();
	});
});
