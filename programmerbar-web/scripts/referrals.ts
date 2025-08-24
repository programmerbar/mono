import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import { referrals, users } from '../src/lib/db/schemas';
import { setup } from './setup';

async function main() {
	const { db } = await setup();

	const allUsers = await db.select({ id: users.id }).from(users);

	if (allUsers.length < 2) {
		console.log('Need at least 2 users to create referrals. Run users.ts first.');
		return;
	}

	console.log(`Found ${allUsers.length} users to create referrals between.`);

	const numberOfReferrals = Math.min(25, Math.floor(allUsers.length / 2));

	const fakeReferrals = Array.from({ length: numberOfReferrals }, () => {
		// Pick two random different users
		const shuffledUsers = faker.helpers.shuffle([...allUsers]);
		const referrer = shuffledUsers[0];
		const referred = shuffledUsers[1];

		const status = faker.helpers.weightedArrayElement([
			{ weight: 3, value: 'completed' as const },
			{ weight: 2, value: 'pending' as const }
		]);

		const createdAt = faker.date.recent({ days: 90 }); // Within last 90 days
		const completedAt =
			status === 'completed' ? faker.date.between({ from: createdAt, to: new Date() }) : null;

		return {
			id: nanoid(),
			referredBy: referrer.id,
			referred: referred.id,
			status,
			createdAt,
			completedAt
		};
	});

	// Insert referrals one by one to avoid parameter limits
	for (const referral of fakeReferrals) {
		try {
			await db.insert(referrals).values(referral);
		} catch (error) {
			console.warn('Skipped duplicate referral:', error);
		}
	}

	console.log(`Added ${fakeReferrals.length} referrals with various statuses.`);
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
