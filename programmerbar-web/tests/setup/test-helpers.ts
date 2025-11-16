import type { Page } from '@playwright/test';
import { setupSanityMocks } from '../fixtures/sanity-mocks';

const unmockedSanityRequests: string[] = [];

/**
 * Setup test environment with mocked external services
 */
export async function setupTestEnvironment(page: Page, options?: { mockSanity?: boolean }) {
	const { mockSanity = true } = options || {};

	if (mockSanity) {
		// Clear any previous unmocked requests
		unmockedSanityRequests.length = 0;

		// Intercept all Sanity API calls
		await page.route('**/api.sanity.io/**', async (route) => {
			const url = route.request().url();
			const wasHandled = await setupSanityMocks(route, url);

			if (!wasHandled) {
				// Track unmocked requests
				unmockedSanityRequests.push(url);
				throw new Error(
					`Unmocked Sanity request detected: ${url}\n` +
						`Please add a mock for this endpoint in tests/fixtures/sanity-mocks.ts`
				);
			}
		});
	}

	// You can add other mocks here (e.g., external APIs, third-party services)
}

/**
 * Get list of unmocked Sanity requests (for debugging)
 */
export function getUnmockedSanityRequests(): string[] {
	return [...unmockedSanityRequests];
}

/**
 * Clear the list of unmocked requests
 */
export function clearUnmockedSanityRequests(): void {
	unmockedSanityRequests.length = 0;
}

/**
 * Clean up test environment
 */
export async function cleanupTestEnvironment(page: Page) {
	// Unroute all mocks
	await page.unroute('**/api.sanity.io/**');
	// Clear unmocked requests list
	clearUnmockedSanityRequests();
}

/**
 * Assert that no unmocked Sanity requests were made
 * Call this at the end of tests to ensure all requests were mocked
 */
export function assertNoUnmockedSanityRequests() {
	const unmocked = getUnmockedSanityRequests();
	if (unmocked.length > 0) {
		throw new Error(
			`Found ${unmocked.length} unmocked Sanity request(s):\n` +
				unmocked.map((url) => `  - ${url}`).join('\n') +
				'\n\nPlease add mocks for these endpoints in tests/fixtures/sanity-mocks.ts'
		);
	}
}

/**
 * Wait for Sanity content to load
 */
export async function waitForSanityContent(page: Page) {
	// Wait for products or events to appear
	await page.waitForSelector(
		'[class*="product"], [class*="event"], text=cat meny.txt, text=ls -la arrangementer/',
		{
			timeout: 10000
		}
	);
}
