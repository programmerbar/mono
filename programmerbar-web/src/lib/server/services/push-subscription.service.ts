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
		console.log(`[PushSubscriptionService] Subscribing user ${userId} to push notifications`);
		console.log(`[PushSubscriptionService] Endpoint: ${subscription.endpoint.substring(0, 50)}...`);

		// Check if subscription already exists
		const existing = await this.#db
			.select()
			.from(table.pushSubscriptions)
			.where(eq(table.pushSubscriptions.endpoint, subscription.endpoint))
			.limit(1);

		if (existing.length > 0) {
			// Update existing subscription (user might have resubscribed)
			console.log(`[PushSubscriptionService] Updating existing subscription for user ${userId}`);
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

		// Create new subscription
		console.log(`[PushSubscriptionService] Creating new subscription for user ${userId}`);
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
		console.log(`[PushSubscriptionService] ✅ Subscription removed`);
	}

	/**
	 * Get all subscriptions for a user
	 */
	async getByUserId(userId: string) {
		console.log(`[PushSubscriptionService] Fetching subscriptions for user: ${userId}`);
		const subscriptions = await this.#db
			.select()
			.from(table.pushSubscriptions)
			.where(eq(table.pushSubscriptions.userId, userId));

		console.log(
			`[PushSubscriptionService] Found ${subscriptions.length} subscription(s) for user ${userId}`
		);
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
		console.log(`[PushSubscriptionService] Deleting subscription by ID: ${id}`);
		await this.#db.delete(table.pushSubscriptions).where(eq(table.pushSubscriptions.id, id));
		console.log(`[PushSubscriptionService] ✅ Subscription deleted: ${id}`);
	}
}

interface PushSubscriptionJSON {
	endpoint: string;
	keys: {
		p256dh: string;
		auth: string;
	};
}
