/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

// Cloudflare preview server runs on port 8787
const FRONTEND_URL = 'http://localhost:8787';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	// Fail the build on CI if you accidentally left test.only in the source code.
	forbidOnly: !!process.env.CI,
	// Retry on CI only
	retries: process.env.CI ? 2 : 0,
	// Opt out of parallel tests on CI.
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? 'github' : 'html',
	use: {
		baseURL: FRONTEND_URL,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure'
	},

	// Configure projects for major browsers
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		},
		// Only run Chromium in CI for faster tests
		...(process.env.CI
			? []
			: [
					{
						name: 'firefox',
						use: { ...devices['Desktop Firefox'] }
					},
					{
						name: 'webkit',
						use: { ...devices['Desktop Safari'] }
					},
					{
						name: 'Mobile Chrome',
						use: { ...devices['Pixel 5'] }
					},
					{
						name: 'Mobile Safari',
						use: { ...devices['iPhone 12'] }
					}
				])
	],

	// Run your local dev server before starting the tests
	webServer: {
		// Preview runs the build and starts the server
		command: 'pnpm run preview',
		url: FRONTEND_URL,
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
		stdout: 'ignore',
		stderr: 'pipe'
	}
});
