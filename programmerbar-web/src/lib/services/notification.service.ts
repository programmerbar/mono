import type { Database } from '$lib/db/drizzle';
import * as table from '$lib/db/schemas';
import { and, eq, isNull, desc } from 'drizzle-orm';

type NotificationPayload = {
	title: string;
	message: string;
};

export class NotificationService {
	#db: Database;

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

	async create(userId: string, title: string, body: string) {
		const notification = await this.#db
			.insert(table.notifications)
			.values({
				userId,
				title,
				body
			})
			.returning();

		return notification[0];
	}

	async sendNotifications(userIds: Array<string>, payload: NotificationPayload) {
		const notifications = userIds.map((userId) => ({
			userId,
			title: payload.title,
			body: payload.message
		}));

		await this.#db.insert(table.notifications).values(notifications);
	}
}
