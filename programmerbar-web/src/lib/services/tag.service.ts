import type { Database } from '$lib/db/drizzle';
import * as table from '$lib/db/schemas';
import { and, eq, inArray } from 'drizzle-orm';

export class TagService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	async getAllTags() {
		const tags = await this.#db.select().from(table.tags).orderBy(table.tags.name);

		return tags;
	}

	async createTag(
		name: string,
		description?: string,
		color?: string,
		options?: {
			canSeeOpplearing?: boolean;
			canSeeBeerClaims?: boolean;
			canSeeEventDepartures?: boolean;
			canSeeReferrals?: boolean;
			canSeeBongs?: boolean;
			canManageTagOptions?: boolean;
			canSeeUserChanges?: boolean;
			canSeeEventUpdates?: boolean;
			canSeeShiftUpdates?: boolean;
			canSeeTagChanges?: boolean;
			canSeeContactSubmissions?: boolean;
		}
	) {
		try {
			const tag = await this.#db
				.insert(table.tags)
				.values({
					name,
					description,
					color,
					...options
				})
				.returning();

			return tag[0] ? true : false;
		} catch {
			return false;
		}
	}

	async updateTag(
		tagId: string,
		updates: {
			name?: string;
			description?: string;
			color?: string;
			canSeeOpplearing?: boolean;
			canSeeBeerClaims?: boolean;
			canSeeEventDepartures?: boolean;
			canSeeReferrals?: boolean;
			canSeeBongs?: boolean;
			canManageTagOptions?: boolean;
			canSeeUserChanges?: boolean;
			canSeeEventUpdates?: boolean;
			canSeeShiftUpdates?: boolean;
			canSeeTagChanges?: boolean;
			canSeeContactSubmissions?: boolean;
		}
	) {
		try {
			const tag = await this.#db
				.update(table.tags)
				.set(updates)
				.where(eq(table.tags.id, tagId))
				.returning();

			return tag[0] ? true : false;
		} catch {
			return false;
		}
	}

	async deleteTag(tagId: string) {
		try {
			await this.#db.delete(table.tags).where(eq(table.tags.id, tagId));
			return true;
		} catch {
			return false;
		}
	}

	async getUsersByTag(tagName: string) {
		const users = await this.#db
			.select({
				id: table.users.id,
				name: table.users.name,
				email: table.users.email,
				role: table.users.role
			})
			.from(table.userTags)
			.innerJoin(table.tags, eq(table.userTags.tagId, table.tags.id))
			.innerJoin(table.users, eq(table.userTags.userId, table.users.id))
			.where(eq(table.tags.name, tagName));

		return users;
	}

	async getUserTags(userId: string) {
		const userTags = await this.#db
			.select({
				id: table.tags.id,
				name: table.tags.name,
				description: table.tags.description,
				color: table.tags.color,
				assignedAt: table.userTags.createdAt
			})
			.from(table.userTags)
			.innerJoin(table.tags, eq(table.userTags.tagId, table.tags.id))
			.where(eq(table.userTags.userId, userId))
			.orderBy(table.tags.name);

		return userTags;
	}

	async getUserTagsForUsers(userIds: string[]) {
		if (userIds.length === 0) return new Map();

		const userTags = await this.#db
			.select({
				userId: table.userTags.userId,
				tagId: table.tags.id,
				tagName: table.tags.name,
				tagDescription: table.tags.description,
				tagColor: table.tags.color,
				assignedAt: table.userTags.createdAt
			})
			.from(table.userTags)
			.innerJoin(table.tags, eq(table.userTags.tagId, table.tags.id))
			.where(inArray(table.userTags.userId, userIds))
			.orderBy(table.tags.name);

		const userTagsMap = new Map<
			string,
			Array<{
				id: string;
				name: string;
				description: string | null;
				color: string | null;
				assignedAt: Date;
			}>
		>();

		for (const userTag of userTags) {
			const existing = userTagsMap.get(userTag.userId) || [];
			existing.push({
				id: userTag.tagId,
				name: userTag.tagName,
				description: userTag.tagDescription,
				color: userTag.tagColor,
				assignedAt: userTag.assignedAt
			});
			userTagsMap.set(userTag.userId, existing);
		}

		return userTagsMap;
	}

	async assignTagToUser(tagId: string, userId: string, assignedBy: string) {
		try {
			const existing = await this.#db
				.select()
				.from(table.userTags)
				.where(and(eq(table.userTags.tagId, tagId), eq(table.userTags.userId, userId)))
				.limit(1);

			if (existing.length > 0) {
				return true;
			}

			const userTag = await this.#db
				.insert(table.userTags)
				.values({
					tagId,
					userId,
					assignedBy
				})
				.returning();

			return userTag[0] ? true : false;
		} catch {
			return false;
		}
	}

	async removeTagFromUser(tagId: string, userId: string) {
		try {
			await this.#db
				.delete(table.userTags)
				.where(and(eq(table.userTags.tagId, tagId), eq(table.userTags.userId, userId)));
			return true;
		} catch {
			return false;
		}
	}

	async getUsersWithTags(tagNames: string[]) {
		if (tagNames.length === 0) return [];

		const users = await this.#db
			.select({
				id: table.users.id,
				name: table.users.name,
				email: table.users.email,
				role: table.users.role
			})
			.from(table.userTags)
			.innerJoin(table.tags, eq(table.userTags.tagId, table.tags.id))
			.innerJoin(table.users, eq(table.userTags.userId, table.users.id))
			.where(inArray(table.tags.name, tagNames));

		const uniqueUsers = users.reduce(
			(acc, user) => {
				if (!acc.find((u) => u.id === user.id)) {
					acc.push(user);
				}
				return acc;
			},
			[] as typeof users
		);

		return uniqueUsers;
	}

	async canManageTags(userId: string) {
		const user = await this.#db
			.select({ role: table.users.role })
			.from(table.users)
			.where(eq(table.users.id, userId))
			.limit(1);

		if (!user[0]) return false;

		const userTags = await this.getUserTags(userId);
		const hasDevTag = userTags.some((tag) => tag.name === 'Dev');
		const hasLederTag = userTags.some((tag) => tag.name === 'Leder');

		return user[0].role === 'board' && (hasDevTag || hasLederTag);
	}

	async canManageTagOptions(userId: string) {
		const userTagsWithOptions = await this.#db
			.select({
				canManageTagOptions: table.tags.canManageTagOptions
			})
			.from(table.userTags)
			.innerJoin(table.tags, eq(table.userTags.tagId, table.tags.id))
			.where(eq(table.userTags.userId, userId));

		return userTagsWithOptions.some((tag) => tag.canManageTagOptions);
	}

	async getUsersWhoCanSee(
		capability:
			| 'opplearing'
			| 'beerClaims'
			| 'eventDepartures'
			| 'referrals'
			| 'bongs'
			| 'userChanges'
			| 'eventUpdates'
			| 'shiftUpdates'
			| 'tagChanges'
			| 'contactSubmissions'
	) {
		const columnMap = {
			opplearing: table.tags.canSeeOpplearing,
			beerClaims: table.tags.canSeeBeerClaims,
			eventDepartures: table.tags.canSeeEventDepartures,
			referrals: table.tags.canSeeReferrals,
			bongs: table.tags.canSeeBongs,
			userChanges: table.tags.canSeeUserChanges,
			eventUpdates: table.tags.canSeeEventUpdates,
			shiftUpdates: table.tags.canSeeShiftUpdates,
			tagChanges: table.tags.canSeeTagChanges,
			contactSubmissions: table.tags.canSeeContactSubmissions
		};

		const users = await this.#db
			.select({
				id: table.users.id,
				name: table.users.name,
				email: table.users.email,
				role: table.users.role
			})
			.from(table.userTags)
			.innerJoin(table.tags, eq(table.userTags.tagId, table.tags.id))
			.innerJoin(table.users, eq(table.userTags.userId, table.users.id))
			.where(eq(columnMap[capability], true));

		const uniqueUsers = users.reduce(
			(acc, user) => {
				if (!acc.find((u) => u.id === user.id)) {
					acc.push(user);
				}
				return acc;
			},
			[] as typeof users
		);

		return uniqueUsers;
	}

	async getTagByName(name: string) {
		const tag = await this.#db.select().from(table.tags).where(eq(table.tags.name, name)).limit(1);

		return tag[0];
	}

	async getTagById(id: string) {
		const tag = await this.#db.select().from(table.tags).where(eq(table.tags.id, id)).limit(1);

		return tag[0];
	}

	async initializeDefaultTags() {
		try {
			const defaultTags = [
				{
					name: 'Dev',
					description: 'Development team',
					color: '#3B82F6',
					options: {
						canSeeOpplearing: true,
						canSeeBeerClaims: true,
						canSeeEventDepartures: true,
						canSeeReferrals: true,
						canSeeBongs: true,
						canManageTagOptions: true,
						canSeeUserChanges: true,
						canSeeEventUpdates: true,
						canSeeShiftUpdates: true,
						canSeeTagChanges: true,
						canSeeContactSubmissions: true
					}
				}
			];

			for (const tagData of defaultTags) {
				const existing = await this.getTagByName(tagData.name);
				if (!existing) {
					await this.createTag(tagData.name, tagData.description, tagData.color, tagData.options);
				} else {
					if (
						(tagData.name === 'Dev' || tagData.name === 'Leder') &&
						!existing.canManageTagOptions
					) {
						await this.updateTag(existing.id, tagData.options!);
					}
				}
			}
			return true;
		} catch {
			return false;
		}
	}
}
