import { buildPushPayload } from '@block65/webcrypto-web-push';
import type { PushSubscriptionService } from './push-subscription.service';
import type { PushSubscription, PushMessage, VapidKeys } from '@block65/webcrypto-web-push';

export class PushNotificationService {
	#pushSubscriptionService: PushSubscriptionService;
	#vapidPublicKey: string;
	#vapidPrivateKey: string;
	#vapidSubject: string;

	constructor(
		pushSubscriptionService: PushSubscriptionService,
		config: {
			vapidPublicKey: string;
			vapidPrivateKey: string;
			vapidSubject: string;
		}
	) {
		this.#pushSubscriptionService = pushSubscriptionService;
		this.#vapidPublicKey = config.vapidPublicKey;
		this.#vapidPrivateKey = config.vapidPrivateKey;
		this.#vapidSubject = config.vapidSubject;
	}

	/**
	 * Send push notification to a specific user
	 */
	async sendToUser(userId: string, payload: PushPayload) {
		console.log(`[PushNotificationService] Attempting to send push to user ${userId}`);
		console.log(`[PushNotificationService] Payload:`, JSON.stringify(payload));

		const subscriptions = await this.#pushSubscriptionService.getByUserId(userId);

		if (subscriptions.length === 0) {
			console.log(`[PushNotificationService] No push subscriptions found for user ${userId}`);
			return { sent: 0, failed: 0 };
		}

		console.log(
			`[PushNotificationService] Found ${subscriptions.length} subscription(s) for user ${userId}`
		);

		const results = await Promise.allSettled(
			subscriptions.map((sub) => this.#sendPush(sub, payload))
		);

		let sent = 0;
		let failed = 0;

		for (let i = 0; i < results.length; i++) {
			const result = results[i];
			if (result.status === 'fulfilled') {
				sent++;
				console.log(
					`[PushNotificationService] ✅ Successfully sent push to ${subscriptions[i].endpoint.substring(0, 50)}...`
				);
				// Update last used timestamp
				await this.#pushSubscriptionService.updateLastUsed(subscriptions[i].endpoint);
			} else {
				failed++;
				console.error(
					`[PushNotificationService] ❌ Failed to send push to ${subscriptions[i].endpoint.substring(0, 50)}...`
				);
				console.error(`[PushNotificationService] Error details:`, result.reason);
				// If subscription is expired/invalid, remove it
				if (this.#isSubscriptionError(result.reason)) {
					console.log(`[PushNotificationService] Removing expired subscription`);
					await this.#pushSubscriptionService.deleteById(subscriptions[i].id);
				}
			}
		}

		console.log(`[PushNotificationService] Push results - Sent: ${sent}, Failed: ${failed}`);
		return { sent, failed };
	}

	/**
	 * Send push notification to multiple users
	 */
	async sendToUsers(userIds: Array<string>, payload: PushPayload) {
		const results = await Promise.allSettled(
			userIds.map((userId) => this.sendToUser(userId, payload))
		);

		const totals = results.reduce(
			(acc, result) => {
				if (result.status === 'fulfilled') {
					acc.sent += result.value.sent;
					acc.failed += result.value.failed;
				}
				return acc;
			},
			{ sent: 0, failed: 0 }
		);

		console.log(
			`Push notification sent to users. Total sent: ${totals.sent}, Total failed: ${totals.failed}`
		);

		return totals;
	}

	/**
	 * Send push to a single subscription
	 * Using @block65/webcrypto-web-push for Cloudflare Workers compatibility
	 */
	async #sendPush(subscription: SubscriptionData, payload: PushPayload) {
		// Prepare subscription object
		const pushSubscription: PushSubscription = {
			endpoint: subscription.endpoint,
			expirationTime: null,
			keys: {
				p256dh: subscription.p256dh,
				auth: subscription.auth
			}
		};

		// Prepare notification payload
		const notificationPayload = JSON.stringify({
			title: payload.title,
			body: payload.body,
			icon: payload.icon || '/android-chrome-192x192.png',
			badge: payload.badge || '/favicon-32x32.png',
			data: payload.data || {}
		});

		// VAPID credentials
		const vapid: VapidKeys = {
			subject: this.#vapidSubject,
			publicKey: this.#vapidPublicKey,
			privateKey: this.#vapidPrivateKey
		};

		// Message to send
		const message: PushMessage = {
			data: notificationPayload,
			options: {
				ttl: 43200 // 12 hours
			}
		};

		// Build push payload using webcrypto-web-push
		const fetchPayload = await buildPushPayload(message, pushSubscription, vapid);

		// Send the push notification
		// Convert body to ArrayBuffer to satisfy TypeScript
		const result = await fetch(pushSubscription.endpoint, {
			...fetchPayload,
			body: fetchPayload.body.buffer as ArrayBuffer
		});

		if (!result.ok) {
			throw new Error(
				`Push notification failed: ${result.status} ${result.statusText || 'Unknown error'}`
			);
		}

		return result;
	}

	/**
	 * Check if error indicates subscription should be removed
	 */
	#isSubscriptionError(error: unknown): boolean {
		if (!error) return false;

		const errorMessage = error instanceof Error ? error.message : String(error);
		// 404 = endpoint not found, 410 = subscription expired
		return errorMessage.includes('404') || errorMessage.includes('410');
	}
}

interface SubscriptionData {
	id: string;
	endpoint: string;
	p256dh: string;
	auth: string;
}

export interface PushPayload {
	title: string;
	body: string;
	icon?: string;
	badge?: string;
	data?: Record<string, unknown>;
}
