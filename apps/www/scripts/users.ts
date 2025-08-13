import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import { User, users } from '../src/lib/db/schemas';
import { setup } from './setup';

/**
 * You have to do one user at a time, becuase D1 only allows
 * for 100 parameters per query.
 */

async function main() {
	const { db } = await setup();

	const fakeNormalUsers = Array.from({ length: 40 }, () => ({
		id: nanoid(),
		email: faker.internet.email(),
		name: faker.person.fullName(),
		role: 'normal' as const,
		additionalBeers: faker.number.int({ min: 0, max: 10 }),
		altEmail: faker.helpers.maybe(() => faker.internet.email()) ?? null,
		feideId: faker.string.uuid()
	}));

	for (const user of fakeNormalUsers) {
		await db.insert(users).values(user);
	}

	const fakeBoardUsers = Array.from(
		{ length: 13 },
		() =>
			({
				id: nanoid(),
				email: faker.internet.email(),
				name: faker.person.fullName(),
				role: 'board' as const,
				additionalBeers: faker.number.int({ min: 0, max: 10 }),
				altEmail: faker.helpers.maybe(() => faker.internet.email()) ?? null,
				feideId: faker.string.uuid()
			}) satisfies User
	);

	for (const user of fakeBoardUsers) {
		await db.insert(users).values(user);
	}

	console.log(
		`Added ${fakeNormalUsers.length} normal users and ${fakeBoardUsers.length} board users.`
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
