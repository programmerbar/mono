import type { Database } from '$lib/db/drizzle';
import * as table from '$lib/db/schemas';
import { and, eq, inArray } from 'drizzle-orm';

export class TagService {
	#db: Database;
	#isInitializing = false;

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
		options?: Record<string, boolean>
	) {
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
	}

	async updateTag(
		tagId: string,
		updates: Record<string, string | boolean | undefined>
	) {
		const tag = await this.#db
			.update(table.tags)
			.set(updates)
			.where(eq(table.tags.id, tagId))
			.returning();

		return tag[0] ? true : false;
	}

	getAvailablePermissions() {
		return [
			{ key: 'canSeeTraining', label: 'Kan se opplæring' },
			{ key: 'canSeeBeerClaims', label: 'Kan se drikke cash-in' },
			{ key: 'canSeeReferrals', label: 'Kan se henvisninger' },
			{ key: 'canSeeBongs', label: 'Kan se bongs' },
			{ key: 'canSeeUserChanges', label: 'Kan se brukerendringer' },
			{ key: 'canSeeEventDepartures', label: 'Kan se arrangement-avgang' },
			{ key: 'canSeeEventUpdates', label: 'Kan se arrangement-oppdateringer' },
			{ key: 'canSeeShiftUpdates', label: 'Kan se vakt-oppdateringer' },
			{ key: 'canManageTagOptions', label: 'Kan administrere tag-alternativer' },
			{ key: 'canSeeTagChanges', label: 'Kan se tag-endringer' },
			{ key: 'canSeeContactSubmissions', label: 'Kan se kontakt-skjema' },
			{ key: 'canSeeNewcomers', label: 'Kan se nykommere' }
		];
	}

	async deleteTag(tagId: string) {
		await this.#db.delete(table.tags).where(eq(table.tags.id, tagId));
		return true;
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
		if (userIds.length === 0) return {};

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

		return userTags.reduce(
			(acc, userTag) => {
				if (!acc[userTag.userId]) acc[userTag.userId] = [];
				acc[userTag.userId].push({
					id: userTag.tagId,
					name: userTag.tagName,
					description: userTag.tagDescription,
					color: userTag.tagColor,
					assignedAt: userTag.assignedAt
				});
				return acc;
			},
			{} as Record<
				string,
				Array<{
					id: string;
					name: string;
					description: string | null;
					color: string | null;
					assignedAt: Date;
				}>
			>
		);
	}

	async assignTagToUser(tagId: string, userId: string, assignedBy: string) {
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
	}

	async removeTagFromUser(tagId: string, userId: string) {
		await this.#db
			.delete(table.userTags)
			.where(and(eq(table.userTags.tagId, tagId), eq(table.userTags.userId, userId)));
		return true;
	}

	async getUsersWithTags(tagNames: string[]) {
		if (tagNames.length === 0) return [];

		const users = await this.#db
			.selectDistinct({
				id: table.users.id,
				name: table.users.name,
				email: table.users.email,
				role: table.users.role
			})
			.from(table.userTags)
			.innerJoin(table.tags, eq(table.userTags.tagId, table.tags.id))
			.innerJoin(table.users, eq(table.userTags.userId, table.users.id))
			.where(inArray(table.tags.name, tagNames));

		return users;
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

	async getTagByName(name: string) {
		const tag = await this.#db.select().from(table.tags).where(eq(table.tags.name, name)).limit(1);

		return tag[0];
	}

	async getTagsByNames(names: string[]) {
		if (names.length === 0) return [];
		return await this.#db.select().from(table.tags).where(inArray(table.tags.name, names));
	}

	async getTagById(id: string) {
		const tag = await this.#db.select().from(table.tags).where(eq(table.tags.id, id)).limit(1);

		return tag[0];
	}

	async initializeDefaultTags() {
		if (this.#isInitializing) return false;
		this.#isInitializing = true;

		const allPermissions = Object.fromEntries(
			this.getAvailablePermissions().map((p) => [p.key, true])
		);

		const defaultTags = [
			{
				name: 'Dev',
				description: 'Dev',
				color: '#3B82F6',
				options: allPermissions
			}
		];

		const existingTags = await this.getTagsByNames(defaultTags.map((t) => t.name));
		const existingTagsMap = Object.fromEntries(existingTags.map((tag) => [tag.name, tag]));

		for (const tagData of defaultTags) {
			const existing = existingTagsMap[tagData.name];
			if (!existing) {
				await this.createTag(tagData.name, tagData.description, tagData.color, tagData.options);
			} else if (!existing.canManageTagOptions) {
				await this.updateTag(existing.id, tagData.options);
			}
		}

		this.#isInitializing = false;
		return true;
	}
}
