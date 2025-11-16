# E2E Tests with Playwright

This directory contains end-to-end tests for the Programmerbar web application using Playwright.

## Running Tests

### Run all tests
```bash
pnpm test:e2e
```

### Run tests in headed mode (see browser)
```bash
pnpm exec playwright test --headed
```

### Run tests for a specific browser
```bash
pnpm exec playwright test --project=chromium
pnpm exec playwright test --project=firefox
pnpm exec playwright test --project=webkit
```

### Run tests on mobile viewports
```bash
pnpm exec playwright test --project="Mobile Chrome"
pnpm exec playwright test --project="Mobile Safari"
```

### Run a specific test file
```bash
pnpm exec playwright test tests/homepage.spec.ts
pnpm exec playwright test tests/menu.spec.ts
pnpm exec playwright test tests/auth.spec.ts
pnpm exec playwright test tests/mobile.spec.ts
pnpm exec playwright test tests/accessibility.spec.ts
```

### Run tests in debug mode
```bash
pnpm exec playwright test --debug
```

### Run tests with UI mode
```bash
pnpm test:e2e:ui
```

## Test Structure

- `homepage.spec.ts` - Homepage loading and display tests
- `menu.spec.ts` - Menu page and product display tests
- `auth.spec.ts` - Authentication and protected route tests
- `mobile.spec.ts` - Mobile responsiveness tests
- `accessibility.spec.ts` - Accessibility and semantic HTML tests
- `helpers.ts` - Reusable test helper functions

## Writing New Tests

### Basic Test Example

```typescript
import { expect, test } from '@playwright/test';

test('my test', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
});
```

### Using Helpers

```typescript
import { waitForPageLoad, waitForCLIWindow } from './helpers';

test('test with helpers', async ({ page }) => {
  await page.goto('/');
  await waitForPageLoad(page);
  await waitForCLIWindow(page, 'cat meny.txt');
});
```

## Configuration

Tests are configured in `playwright.config.ts`. The configuration includes:

- Multiple browser projects (Chromium, Firefox, WebKit)
- Mobile viewport testing (Pixel 5, iPhone 12)
- Automatic server startup before tests
- Screenshots on failure
- Trace collection on retry

## CI/CD

Tests can be run in CI environments. The configuration automatically:
- Uses GitHub reporter in CI
- Retries failed tests twice
- Runs with a single worker for stability

