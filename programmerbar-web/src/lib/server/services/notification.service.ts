import type { Database } from '$lib/server/db/drizzle';
import * as table from '$lib/server/db/schemas';
import { and, eq, isNull, desc } from 'drizzle-orm';
import type { PushNotificationService } from './push-notification.service';

type NotificationPayload = {
	title: string;
	message: string;
};

export class NotificationService {
	#db: Database;
	#pushNotificationService?: PushNotificationService;

	constructor(db: Database, pushNotificationService?: PushNotificationService) {
		this.#db = db;
		this.#pushNotificationService = pushNotificationService;
	}

	async getUnarchived(userId: string) {
		console.log(`[NotificationService] Fetching unarchived notifications for user: ${userId}`);
		const notifications = await this.#db
			.select()
			.from(table.notifications)
			.where(and(eq(table.notifications.userId, userId), isNull(table.notifications.archivedAt)))
			.orderBy(desc(table.notifications.createdAt));

		console.log(
			`[NotificationService] Found ${notifications.length} unarchived notification(s) for user ${userId}`
		);
		return notifications;
	}

	async archive(notificationId: string) {
		console.log(`[NotificationService] Archiving notification: ${notificationId}`);
		const notification = await this.#db
			.update(table.notifications)
			.set({ archivedAt: new Date() })
			.where(eq(table.notifications.id, notificationId))
			.returning();

		console.log(`[NotificationService] ✅ Notification archived: ${notificationId}`);
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
		console.log(`[NotificationService] Creating notification for user ${userId}: "${title}"`);
		const notification = await this.#db
			.insert(table.notifications)
			.values({
				userId,
				title,
				body
			})
			.returning();

		console.log(`[NotificationService] ✅ Notification created: ${notification[0].id}`);

		// Send push notification if service is available
		if (this.#pushNotificationService) {
			console.log(`[NotificationService] Triggering push notification for user ${userId}`);
			await this.#pushNotificationService
				.sendToUser(userId, {
					title,
					body: body || ''
				})
				.catch((error) => {
					console.error(`[NotificationService] ❌ Failed to send push notification:`, error);
				});
		} else {
			console.log(`[NotificationService] Push notification service not available, skipping push`);
		}

		return notification[0];
	}

	async sendNotifications(userIds: Array<string>, payload: NotificationPayload) {
		console.log(
			`[NotificationService] Sending notifications to ${userIds.length} user(s): "${payload.title}"`
		);
		const notifications = userIds.map((userId) => ({
			userId,
			title: payload.title,
			body: payload.message
		}));

		await this.#db.insert(table.notifications).values(notifications);
		console.log(
			`[NotificationService] ✅ Created ${notifications.length} notification(s) in database`
		);

		// Send push notifications if service is available
		if (this.#pushNotificationService) {
			console.log(
				`[NotificationService] Triggering push notifications for ${userIds.length} user(s)`
			);
			await this.#pushNotificationService
				.sendToUsers(userIds, {
					title: payload.title,
					body: payload.message
				})
				.catch((error) => {
					console.error(`[NotificationService] ❌ Failed to send push notifications:`, error);
				});
		} else {
			console.log(`[NotificationService] Push notification service not available, skipping push`);
		}
	}
}
