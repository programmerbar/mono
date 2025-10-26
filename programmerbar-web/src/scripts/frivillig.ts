import { faker } from '@faker-js/faker';
import { pendingApplications } from '../lib/db/schemas';
import { nanoid } from 'nanoid';
import { setup } from './setup';

/// Creates frivillige users, via the "bli-frivillig" button on the homepage.
async function main() {
	const { db } = await setup();

	const fakeApplications = Array.from({ length: 10 }, () => ({
		id: nanoid(),
		name: faker.person.fullName(),
		email: faker.internet.email(),
		feideId: faker.string.uuid(),
		createdAt: new Date()
	}));

	for (const application of fakeApplications) {
		await db.insert(pendingApplications).values(application);
	}

	console.log(`Added ${fakeApplications.length} pending volunteer applications.`);
	console.log(
		`You can now view and approve/deny these applications in the admin panel at /portal/admin/soknader`
	);
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
