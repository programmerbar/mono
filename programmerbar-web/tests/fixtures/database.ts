/**
 * Database test utilities
 *
 * For e2e tests, you can use a local D1 database by:
 * 1. Creating a test database: `wrangler d1 create progbar-db-test`
 * 2. Running migrations: `wrangler d1 migrations apply progbar-db-test --local`
 * 3. Seeding test data: `pnpm dlx tsx scripts/seed.ts` (with test env vars)
 *
 * Or use Playwright's ability to intercept and mock database calls
 * if you want to test without a real database.
 */

export const testDatabaseConfig = {
	// Use local D1 database for tests
	local: true,
	databaseName: 'progbar-db-test'
};

/**
 * Test data seeds for common scenarios
 */
export const testSeeds = {
	users: [
		{
			feideId: 'test-user-1',
			email: 'test@example.com',
			name: 'Test User',
			role: 'normal' as const,
			trainingCompleted: true
		}
	],
	events: [
		{
			title: 'Test Event',
			slug: 'test-event',
			date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			isPublic: true
		}
	]
};

