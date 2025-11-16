import { expect, test } from '@playwright/test';
import { setupTestEnvironment } from './setup/test-helpers';

test.describe('Homepage', () => {
	test.beforeEach(async ({ page }) => {
		// Setup mocked Sanity CMS for consistent test data
		await setupTestEnvironment(page, { mockSanity: true });
	});
	test('should load and display the homepage', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/Programmerbar/i);
	});

	test('should have navigation header', async ({ page }) => {
		await page.goto('/');
		const header = page.locator('header, [role="banner"]').first();
		await expect(header).toBeVisible();
	});

	test('should display menu list', async ({ page }) => {
		await page.goto('/');
		const menuWindow = page.locator('text=cat meny.txt').first();
		await expect(menuWindow).toBeVisible();
	});

	test('should display event list', async ({ page }) => {
		await page.goto('/');
		const eventWindow = page.locator('text=ls -la arrangementer/').first();
		await expect(eventWindow).toBeVisible();
	});

	test('should have working navigation links', async ({ page }) => {
		await page.goto('/');

		// Check if menu link exists and is clickable
		const menuLink = page.locator('a[href*="/meny"]').first();
		if (await menuLink.isVisible()) {
			await menuLink.click();
			await expect(page).toHaveURL(/.*meny/);
		}
	});
});

