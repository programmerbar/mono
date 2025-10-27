import type { Database } from '$lib/server/db/drizzle';
import * as table from '$lib/server/db/schemas';
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
		const existing = await this.#db
			.select()
			.from(table.pushSubscriptions)
			.where(eq(table.pushSubscriptions.endpoint, subscription.endpoint))
			.limit(1);

		if (existing.length > 0) {
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

			console.log(`[PushSubscriptionService] ✅ Subscription updated: ${updated[0].id}`);
			return updated[0];
		}

		const created = await this.#db
			.insert(table.pushSubscriptions)
			.values({
				userId,
				endpoint: subscription.endpoint,
				p256dh: subscription.keys.p256dh,
				auth: subscription.keys.auth
			})
			.returning();

		console.log(`[PushSubscriptionService] ✅ Subscription created: ${created[0].id}`);
		return created[0];
	}

	/**
	 * Unsubscribe from push notifications
	 */
	async unsubscribe(endpoint: string) {
		console.log(
			`[PushSubscriptionService] Unsubscribing endpoint: ${endpoint.substring(0, 50)}...`
		);
		await this.#db
			.delete(table.pushSubscriptions)
			.where(eq(table.pushSubscriptions.endpoint, endpoint));
	}

	/**
	 * Get all subscriptions for a user
	 */
	async getByUserId(userId: string) {
		const subscriptions = await this.#db
			.select()
			.from(table.pushSubscriptions)
			.where(eq(table.pushSubscriptions.userId, userId));

		return subscriptions;
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
