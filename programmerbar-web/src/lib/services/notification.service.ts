import type { Database } from '$lib/db/drizzle';
import * as table from '$lib/db/schemas';
import { and, eq, isNull, desc, inArray } from 'drizzle-orm';

export class NotificationService {
	#db: Database;
	#permissionCache = new Map<string, { userIds: string[]; timestamp: number }>();
	#cacheTimeout = 5 * 60 * 1000; // 5 minutes
	#userNameCache = new Map<string, { name: string; timestamp: number }>();

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

		if (cached && Date.now() - cached.timestamp < this.#cacheTimeout) {
			return cached.userIds;
		}

		const users = await this.#db
			.select({
				id: table.users.id
			})
			.from(table.userTags)
			.innerJoin(table.tags, eq(table.userTags.tagId, table.tags.id))
			.innerJoin(table.users, eq(table.userTags.userId, table.users.id))
			.where(eq(table.tags[permissionColumn], true));

		const uniqueUserIds = [...new Set(users.map((user) => user.id))];

		// Cache the result
		this.#permissionCache.set(cacheKey, {
			userIds: uniqueUserIds,
			timestamp: Date.now()
		});

		return uniqueUserIds;
	}

	async #notifyUsersWithPermission(
		permissionColumn: keyof typeof table.tags.$inferSelect,
		title: string,
		body: string
	) {
		const uniqueUserIds = await this.#getUsersWithPermission(permissionColumn);

		if (uniqueUserIds.length === 0) return [];

		// Single bulk insert instead of multiple individual inserts
		const notifications = await this.#db
			.insert(table.notifications)
			.values(
				uniqueUserIds.map((userId) => ({
					userId,
					title,
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

		const now = Date.now();
		const cachedNames = new Map<string, string>();
		const uncachedIds: string[] = [];

		// Check cache first
		for (const id of userIds) {
			const cached = this.#userNameCache.get(id);
			if (cached && now - cached.timestamp < this.#cacheTimeout) {
				cachedNames.set(id, cached.name);
			} else {
				uncachedIds.push(id);
			}
		}

		// Fetch uncached names
		if (uncachedIds.length > 0) {
			const users = await this.#db
				.select({ id: table.users.id, name: table.users.name })
				.from(table.users)
				.where(inArray(table.users.id, uncachedIds));

			// Cache the fetched names
			for (const user of users) {
				const name = user.name || 'Ukjent bruker';
				cachedNames.set(user.id, name);
				this.#userNameCache.set(user.id, { name, timestamp: now });
			}

			// Handle missing users
			for (const id of uncachedIds) {
				if (!cachedNames.has(id)) {
					cachedNames.set(id, 'Ukjent bruker');
					this.#userNameCache.set(id, { name: 'Ukjent bruker', timestamp: now });
				}
			}
		}

		// Return names in the same order as requested IDs
		return userIds.map((id) => cachedNames.get(id) || 'Ukjent bruker');
	}

	async createForTag(tagName: string, title: string, body: string) {
		// Get tag ID
		const tag = await this.#db
			.select()
			.from(table.tags)
			.where(eq(table.tags.name, tagName))
			.limit(1);

		if (!tag[0]) {
			throw new Error(`Tag ${tagName} not found`);
		}

		// Get all users with this tag
		const users = await this.#db
			.select({
				id: table.users.id
			})
			.from(table.userTags)
			.innerJoin(table.users, eq(table.userTags.userId, table.users.id))
			.where(eq(table.userTags.tagId, tag[0].id));

		// Create notifications for all users with this tag
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

		// Get tag IDs
		const tags = await this.#db.select().from(table.tags).where(inArray(table.tags.name, tagNames));

		if (tags.length === 0) return [];

		// Get all users with any of these tags
		const tagIds = tags.map((t) => t.id);
		const users = await this.#db
			.select({
				id: table.users.id
			})
			.from(table.userTags)
			.innerJoin(table.users, eq(table.userTags.userId, table.users.id))
			.where(inArray(table.userTags.tagId, tagIds));

		// Remove duplicates
		const uniqueUsers = users.reduce(
			(acc, user) => {
				if (!acc.find((u) => u.id === user.id)) {
					acc.push(user);
				}
				return acc;
			},
			[] as typeof users
		);

		// Create notifications for all unique users
		const notifications = await Promise.all(
			uniqueUsers.map((user) =>
				this.#db
					.insert(table.notifications)
					.values({
						userId: user.id,
						title,
						body,
						// Use the first tag ID for the notification
						tagId: tags[0].id
					})
					.returning()
			)
		);

		return notifications.map((n) => n[0]);
	}

	async notifyOpplaering(userId: string, userEmail: string) {
		return this.#notifyUsersWithPermission(
			'canSeeOpplearing',
			'🎓 Opplæring påkrevd',
			`${userEmail} trenger opplæring.`
		);
	}

	async notifyBeerClaim(userId: string, productName: string, quantity: number, timestamp: Date) {
		const userName = await this.#getUserName(userId);
		const formattedTime = timestamp.toLocaleString('nb-NO');
		return this.#notifyUsersWithPermission(
			'canSeeBeerClaims',
			'🍺 Drikke innløst',
			`${userName} innløste ${quantity}x ${productName} kl. ${formattedTime}`
		);
	}

	async notifyEventDeparture(userId: string, eventName: string, shiftName?: string) {
		const userName = await this.#getUserName(userId);
		const shiftInfo = shiftName ? ` fra vakt "${shiftName}"` : '';
		return this.#notifyUsersWithPermission(
			'canSeeEventDepartures',
			'🚪 Forlot arrangement',
			`${userName} forlot arrangementet "${eventName}"${shiftInfo}`
		);
	}

	async notifyReferral(referrerEmail: string, referredEmail: string) {
		return this.#notifyUsersWithPermission(
			'canSeeReferrals',
			'👥 Ny henvisning',
			`${referrerEmail} henviste ${referredEmail} til å bli med i Programmerbar`
		);
	}

	async notifyBong(
		giverUserId: string,
		receiverUserId: string,
		quantity: number,
		productName?: string
	) {
		const [giverName, receiverName] = await this.#getUserNames([giverUserId, receiverUserId]);
		const product = productName ? ` (${productName})` : '';
		const formattedTime = new Date().toLocaleString('nb-NO');
		return this.#notifyUsersWithPermission(
			'canSeeBongs',
			'🍻 Bong gitt',
			`${giverName} ga ${quantity}x bong${product} til ${receiverName} kl. ${formattedTime}`
		);
	}

	async notifyUserRoleChange(userId: string, newRole: string, changedBy: string) {
		const [userName, adminName] = await this.#getUserNames([userId, changedBy]);
		const roleText = newRole === 'board' ? 'styret' : 'frivillig';
		return this.#notifyUsersWithPermission(
			'canSeeUserChanges',
			'👤 Rolle endret',
			`${userName} ble endret til ${roleText}-rolle av ${adminName || 'System'}`
		);
	}

	async notifyTrainingComplete(userId: string, completedBy: string) {
		const [userName, adminName] = await this.#getUserNames([userId, completedBy]);
		return this.#notifyUsersWithPermission(
			'canSeeUserChanges',
			'🎓 Opplæring fullført',
			`${userName} fullførte opplæringen (markert av ${adminName || 'System'})`
		);
	}

	async notifyEventCreated(eventName: string, eventDate: Date, createdBy: string) {
		const creatorName = await this.#getUserName(createdBy);
		const formattedDate = eventDate.toLocaleDateString('nb-NO');
		return this.#notifyUsersWithPermission(
			'canSeeEventUpdates',
			'📅 Nytt arrangement',
			`"${eventName}" planlagt for ${formattedDate} av ${creatorName}`
		);
	}

	async notifyEventUpdated(eventName: string, updatedBy: string) {
		const updaterName = await this.#getUserName(updatedBy);
		return this.#notifyUsersWithPermission(
			'canSeeEventUpdates',
			'⚠️ Arrangement oppdatert',
			`"${eventName}" detaljer ble endret av ${updaterName}`
		);
	}

	async notifyShiftAssigned(
		eventName: string,
		shiftTime: string,
		assignedUserId: string,
		assignedBy: string
	) {
		const [assignedUserName, assignerName] = await this.#getUserNames([assignedUserId, assignedBy]);
		return this.#notifyUsersWithPermission(
			'canSeeShiftUpdates',
			'👥 Vakt tildelt',
			`${assignedUserName} tildelt til "${eventName}" (${shiftTime}) av ${assignerName || 'System'}`
		);
	}

	async notifyTagAssigned(tagName: string, assignedUserId: string, assignedBy: string) {
		const [assignedUserName, assignerName] = await this.#getUserNames([assignedUserId, assignedBy]);
		return this.#notifyUsersWithPermission(
			'canSeeTagChanges',
			'🏷️ Tag tildelt',
			`"${tagName}" tag tildelt til ${assignedUserName} av ${assignerName || 'System'}`
		);
	}

	async notifyTagRemoved(tagName: string, removedFromUserId: string, removedBy: string) {
		const [removedUserName, removerName] = await this.#getUserNames([removedFromUserId, removedBy]);
		return this.#notifyUsersWithPermission(
			'canSeeTagChanges',
			'🏷️ Tag fjernet',
			`"${tagName}" tag fjernet fra ${removedUserName} av ${removerName || 'System'}`
		);
	}

	async notifyContactSubmission(name: string, email: string, message: string) {
		const truncatedMessage = message.length > 100 ? message.substring(0, 100) + '...' : message;
		return this.#notifyUsersWithPermission(
			'canSeeContactSubmissions',
			'📧 Kontakt-skjema',
			`${name} (${email}) sendte: "${truncatedMessage}"`
		);
	}

	async notifyUserDeleted(deletedUserName: string, deletedBy: string) {
		const adminName = await this.#getUserName(deletedBy);
		return this.#notifyUsersWithPermission(
			'canSeeUserChanges',
			'🗑️ Bruker slettet',
			`${deletedUserName} ble slettet fra systemet av ${adminName || 'System'}`
		);
	}

	async notifyNewcomer(newUserName: string, newUserEmail: string, approvedBy: string) {
		const adminName = await this.#getUserName(approvedBy);
		return this.#notifyUsersWithPermission(
			'canSeeNewcomers',
			'👋 Ny bruker',
			`${newUserName} (${newUserEmail}) ble godkjent og lagt til av ${adminName || 'System'}`
		);
	}
}
