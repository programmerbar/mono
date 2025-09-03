import type { Database } from '$lib/db/drizzle';
import * as table from '$lib/db/schemas';
import { and, eq, isNull, desc, inArray } from 'drizzle-orm';
import { NOTIFICATION_TEMPLATES } from '$lib/config/notifications';
import { Cache } from '$lib/utils/cache';

export class NotificationService {
	#db: Database;
	#permissionCache = new Cache<string[]>(5 * 60 * 1000);
	#userNameCache = new Cache<string>(5 * 60 * 1000);

	constructor(db: Database) {
		this.#db = db;
	}

	async getUnarchived(userId: string) {
		const notifications = await this.#db
			.select()
			.from(table.notifications)
			.where(and(eq(table.notifications.userId, userId), isNull(table.notifications.archivedAt)))
			.orderBy(desc(table.notifications.createdAt));

		return notifications;
	}

	async archive(notificationId: string) {
		const notification = await this.#db
			.update(table.notifications)
			.set({ archivedAt: new Date() })
			.where(eq(table.notifications.id, notificationId))
			.returning();

		return notification[0];
	}

	async find(notificationId: string) {
		const notification = await this.#db
			.select()
			.from(table.notifications)
			.where(eq(table.notifications.id, notificationId))
			.limit(1);

		return notification[0];
	}

	async create(userId: string, title: string, body: string, tagId?: string) {
		const notification = await this.#db
			.insert(table.notifications)
			.values({
				userId,
				title,
				body,
				tagId
			})
			.returning();

		return notification[0];
	}

	async #getUsersWithPermission(
		permissionColumn: keyof typeof table.tags.$inferSelect
	): Promise<string[]> {
		const cacheKey = String(permissionColumn);
		const cached = this.#permissionCache.get(cacheKey);
		if (cached) return cached;

		const users = await this.#db
			.select({
				id: table.users.id
			})
			.from(table.userTags)
			.innerJoin(table.tags, eq(table.userTags.tagId, table.tags.id))
			.innerJoin(table.users, eq(table.userTags.userId, table.users.id))
			.where(eq(table.tags[permissionColumn], true));

		const uniqueUserIds = [...new Set(users.map((user) => user.id))];
		this.#permissionCache.set(cacheKey, uniqueUserIds);
		return uniqueUserIds;
	}

	async notify(templateKey: keyof typeof NOTIFICATION_TEMPLATES, data: any) {
		const template = NOTIFICATION_TEMPLATES[templateKey];
		const uniqueUserIds = await this.#getUsersWithPermission(template.permission);

		if (uniqueUserIds.length === 0) return [];

		const body = template.body(data);
		const notifications = await this.#db
			.insert(table.notifications)
			.values(
				uniqueUserIds.map((userId) => ({
					userId,
					title: template.title,
					body
				}))
			)
			.returning();

		return notifications;
	}

	async #getUserName(userId: string): Promise<string> {
		const names = await this.#getUserNames([userId]);
		return names[0];
	}

	async #getUserNames(userIds: string[]): Promise<string[]> {
		if (userIds.length === 0) return [];

		const cachedNames = new Map<string, string>();
		const uncachedIds: string[] = [];

		for (const id of userIds) {
			const cached = this.#userNameCache.get(id);
			if (cached) {
				cachedNames.set(id, cached);
			} else {
				uncachedIds.push(id);
			}
		}

		if (uncachedIds.length > 0) {
			const users = await this.#db
				.select({ id: table.users.id, name: table.users.name })
				.from(table.users)
				.where(inArray(table.users.id, uncachedIds));

			for (const user of users) {
				const name = user.name || 'Ukjent bruker';
				cachedNames.set(user.id, name);
				this.#userNameCache.set(user.id, name);
			}

			for (const id of uncachedIds) {
				if (!cachedNames.has(id)) {
					const name = 'Ukjent bruker';
					cachedNames.set(id, name);
					this.#userNameCache.set(id, name);
				}
			}
		}

		return userIds.map((id) => cachedNames.get(id) || 'Ukjent bruker');
	}

	async createForTag(tagName: string, title: string, body: string) {
		const tag = await this.#db
			.select()
			.from(table.tags)
			.where(eq(table.tags.name, tagName))
			.limit(1);

		if (!tag[0]) {
			throw new Error(`Tag ${tagName} not found`);
		}

		const users = await this.#db
			.select({
				id: table.users.id
			})
			.from(table.userTags)
			.innerJoin(table.users, eq(table.userTags.userId, table.users.id))
			.where(eq(table.userTags.tagId, tag[0].id));

		const notifications = await Promise.all(
			users.map((user) =>
				this.#db
					.insert(table.notifications)
					.values({
						userId: user.id,
						title,
						body,
						tagId: tag[0].id
					})
					.returning()
			)
		);

		return notifications.map((n) => n[0]);
	}

	async createForMultipleTags(tagNames: string[], title: string, body: string) {
		if (tagNames.length === 0) return [];

		const tags = await this.#db.select().from(table.tags).where(inArray(table.tags.name, tagNames));

		if (tags.length === 0) return [];

		const tagIds = tags.map((t) => t.id);
		const users = await this.#db
			.select({
				id: table.users.id
			})
			.from(table.userTags)
			.innerJoin(table.users, eq(table.userTags.userId, table.users.id))
			.where(inArray(table.userTags.tagId, tagIds));

		const uniqueUsers = users.reduce(
			(acc, user) => {
				if (!acc.find((u) => u.id === user.id)) {
					acc.push(user);
				}
				return acc;
			},
			[] as typeof users
		);

		const notifications = await Promise.all(
			uniqueUsers.map((user) =>
				this.#db
					.insert(table.notifications)
					.values({
						userId: user.id,
						title,
						body,
						tagId: tags[0].id
					})
					.returning()
			)
		);

		return notifications.map((n) => n[0]);
	}

	async notifyOpplaering(userId: string, userEmail: string) {
		return this.notify('opplaering', { userEmail });
	}

	async notifyBeerClaim(userId: string, productName: string, quantity: number, timestamp: Date) {
		const userName = await this.#getUserName(userId);
		return this.notify('beerClaim', { userName, productName, quantity, timestamp });
	}

	async notifyEventDeparture(userId: string, eventName: string, shiftTime?: string) {
		const userName = await this.#getUserName(userId);
		return this.notify('eventDeparture', { userName, eventName, shiftTime });
	}

	async notifyReferral(referrerEmail: string, referredEmail: string) {
		return this.notify('referral', { referrerEmail, referredEmail });
	}

	async notifyBong(
		giverUserId: string,
		receiverUserId: string,
		quantity: number,
		productName?: string
	) {
		const [giverName, receiverName] = await this.#getUserNames([giverUserId, receiverUserId]);
		return this.notify('bong', { giverName, receiverName, quantity, productName });
	}

	async notifyUserRoleChange(userId: string, newRole: string, changedBy: string) {
		const [userName, adminName] = await this.#getUserNames([userId, changedBy]);
		return this.notify('userRoleChange', { userName, newRole, adminName });
	}

	async notifyTrainingComplete(userId: string, completedBy: string) {
		const [userName, adminName] = await this.#getUserNames([userId, completedBy]);
		return this.notify('trainingComplete', { userName, adminName });
	}

	async notifyEventCreated(eventName: string, eventDate: Date, createdBy: string) {
		const creatorName = await this.#getUserName(createdBy);
		return this.notify('eventCreated', { eventName, eventDate, creatorName });
	}

	async notifyEventUpdated(eventName: string, updatedBy: string) {
		const updaterName = await this.#getUserName(updatedBy);
		return this.notify('eventUpdated', { eventName, updaterName });
	}

	async notifyShiftAssigned(
		eventName: string,
		shiftTime: string,
		assignedUserId: string,
		assignedBy: string
	) {
		const [assignedUserName, assignerName] = await this.#getUserNames([assignedUserId, assignedBy]);
		return this.notify('shiftAssigned', { assignedUserName, eventName, shiftTime, assignerName });
	}

	async notifyTagAssigned(tagName: string, assignedUserId: string, assignedBy: string) {
		const [assignedUserName, assignerName] = await this.#getUserNames([assignedUserId, assignedBy]);
		return this.notify('tagAssigned', { tagName, assignedUserName, assignerName });
	}

	async notifyTagRemoved(tagName: string, removedFromUserId: string, removedBy: string) {
		const [removedUserName, removerName] = await this.#getUserNames([removedFromUserId, removedBy]);
		return this.notify('tagRemoved', { tagName, removedUserName, removerName });
	}

	async notifyContactSubmission(name: string, email: string, message: string) {
		return this.notify('contactSubmission', { name, email, message });
	}

	async notifyUserDeleted(deletedUserName: string, deletedBy: string) {
		const adminName = await this.#getUserName(deletedBy);
		return this.notify('userDeleted', { deletedUserName, adminName });
	}

	async notifyNewcomer(newUserName: string, newUserEmail: string, approvedBy: string) {
		const adminName = await this.#getUserName(approvedBy);
		return this.notify('newcomer', { newUserName, newUserEmail, adminName });
	}
}
