import type { Database } from '$lib/db/drizzle';
import * as table from '$lib/db/schemas';
import { eq } from 'drizzle-orm';

export class PushSubscriptionService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	/**
	 * Subscribe a user to push notifications
	 */
	async subscribe(userId: string, subscription: PushSubscriptionJSON) {
		// Check if subscription already exists
		const existing = await this.#db
			.select()
			.from(table.pushSubscriptions)
			.where(eq(table.pushSubscriptions.endpoint, subscription.endpoint))
			.limit(1);

		if (existing.length > 0) {
			// Update existing subscription (user might have resubscribed)
			const updated = await this.#db
				.update(table.pushSubscriptions)
				.set({
					userId,
					p256dh: subscription.keys.p256dh,
					auth: subscription.keys.auth,
					lastUsedAt: new Date()
				})
				.where(eq(table.pushSubscriptions.endpoint, subscription.endpoint))
				.returning();

			return updated[0];
		}

		// Create new subscription
		const created = await this.#db
			.insert(table.pushSubscriptions)
			.values({
				userId,
				endpoint: subscription.endpoint,
				p256dh: subscription.keys.p256dh,
				auth: subscription.keys.auth
			})
			.returning();

		return created[0];
	}

	/**
	 * Unsubscribe from push notifications
	 */
	async unsubscribe(endpoint: string) {
		await this.#db
			.delete(table.pushSubscriptions)
			.where(eq(table.pushSubscriptions.endpoint, endpoint));
	}

	/**
	 * Get all subscriptions for a user
	 */
	async getByUserId(userId: string) {
		return await this.#db
			.select()
			.from(table.pushSubscriptions)
			.where(eq(table.pushSubscriptions.userId, userId));
	}

	/**
	 * Get subscription by endpoint
	 */
	async getByEndpoint(endpoint: string) {
		const subscriptions = await this.#db
			.select()
			.from(table.pushSubscriptions)
			.where(eq(table.pushSubscriptions.endpoint, endpoint))
			.limit(1);

		return subscriptions[0];
	}

	/**
	 * Update last used timestamp for a subscription
	 */
	async updateLastUsed(endpoint: string) {
		await this.#db
			.update(table.pushSubscriptions)
			.set({ lastUsedAt: new Date() })
			.where(eq(table.pushSubscriptions.endpoint, endpoint));
	}

	/**
	 * Delete subscription by ID (for cleanup of failed pushes)
	 */
	async deleteById(id: string) {
		await this.#db.delete(table.pushSubscriptions).where(eq(table.pushSubscriptions.id, id));
	}
}

interface PushSubscriptionJSON {
	endpoint: string;
	keys: {
		p256dh: string;
		auth: string;
	};
}
