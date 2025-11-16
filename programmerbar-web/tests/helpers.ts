import { expect, type Page } from '@playwright/test';

/**
 * Helper function to wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page) {
	await page.waitForLoadState('networkidle');
	await page.waitForLoadState('domcontentloaded');
}

/**
 * Helper function to check if element is visible (with timeout)
 */
export async function isVisible(page: Page, selector: string, timeout = 5000): Promise<boolean> {
	try {
		await page.waitForSelector(selector, { state: 'visible', timeout });
		return true;
	} catch {
		return false;
	}
}

/**
 * Helper function to get text content safely
 */
export async function getTextContent(page: Page, selector: string): Promise<string | null> {
	try {
		return await page.locator(selector).first().textContent();
	} catch {
		return null;
	}
}

/**
 * Helper function to wait for CLI window to be visible
 */
export async function waitForCLIWindow(page: Page, title: string) {
	const window = page.locator(`text=${title}`).first();
	await expect(window).toBeVisible({ timeout: 10000 });
	return window;
}
