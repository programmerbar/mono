import { users, tags, userTags } from '../src/lib/db/schemas';
import { nanoid } from 'nanoid';
import { setup } from './setup';
import { eq, and } from 'drizzle-orm';

async function main() {
	const { db } = await setup();

	const email = process.argv[2];

	if (!email) {
		console.error('Usage: pnpm dlx tsx scripts/tags.ts "your@email.no"');
		process.exit(1);
	}

	console.log(`🏷️  Assigning Dev tag to user: ${email}`);

	try {
		const allUsers = await db.select().from(users);
		const user = allUsers.find((u) => u.email === email || u.altEmail === email);

		if (!user) {
			console.error(`❌ User with email ${email} not found`);
			console.log('Available users:');
			allUsers.forEach((u) => console.log(`  - ${u.name} (${u.email})`));
			process.exit(1);
		}

		console.log(`👤 Found user: ${user.name} (${user.email})`);

		const defaultTags = [
			{
				name: 'Dev',
				description: 'Development team',
				color: '#3B82F6',
				canSeeOpplearing: true,
				canSeeBeerClaims: true,
				canSeeEventDepartures: true,
				canSeeReferrals: true,
				canSeeBongs: true,
				canManageTagOptions: true
			}
		];

		for (const tagData of defaultTags) {
			const existingTag = await db.select().from(tags).where(eq(tags.name, tagData.name)).limit(1);
			if (existingTag.length === 0) {
				await db.insert(tags).values({
					id: nanoid(),
					name: tagData.name,
					description: tagData.description,
					color: tagData.color,
					canSeeOpplearing: tagData.canSeeOpplearing,
					canSeeBeerClaims: tagData.canSeeBeerClaims,
					canSeeEventDepartures: tagData.canSeeEventDepartures,
					canSeeReferrals: tagData.canSeeReferrals,
					canSeeBongs: tagData.canSeeBongs,
					canManageTagOptions: tagData.canManageTagOptions,
					createdAt: new Date()
				});
				console.log(`✅ Created ${tagData.name} tag with permissions`);
			}
		}

		// Find Dev tag
		const devTagResult = await db.select().from(tags).where(eq(tags.name, 'Dev')).limit(1);
		const devTag = devTagResult[0];

		if (!devTag) {
			console.error('❌ Failed to create Dev tag');
			process.exit(1);
		}

		// Check if user already has Dev tag
		const existingUserTag = await db
			.select()
			.from(userTags)
			.where(and(eq(userTags.userId, user.id), eq(userTags.tagId, devTag.id)))
			.limit(1);

		if (existingUserTag.length > 0) {
			console.log(`✅ User ${user.name} already has the Dev tag`);
		} else {
			// Assign Dev tag to user
			await db.insert(userTags).values({
				id: nanoid(),
				userId: user.id,
				tagId: devTag.id,
				assignedBy: user.id, // Self-assigned for script
				createdAt: new Date()
			});
			console.log(`✅ Assigned Dev tag to ${user.name}`);
		}

		// Show user's tags
		const userTagsResult = await db
			.select({
				name: tags.name,
				description: tags.description,
				color: tags.color
			})
			.from(userTags)
			.innerJoin(tags, eq(userTags.tagId, tags.id))
			.where(eq(userTags.userId, user.id));

		console.log('\n🏷️  User tags:');
		userTagsResult.forEach((tag) => {
			console.log(`  • ${tag.name} (${tag.description || 'No description'})`);
		});

		console.log('\n✨ Done! You can now manage tags in the admin panel.');
	} catch (error) {
		console.error('❌ Error:', error);
		process.exit(1);
	}
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
