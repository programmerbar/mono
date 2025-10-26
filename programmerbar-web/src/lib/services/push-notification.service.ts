import webpush from 'web-push';
import type { PushSubscriptionService } from './push-subscription.service';

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
		const subscriptions = await this.#pushSubscriptionService.getByUserId(userId);

		if (subscriptions.length === 0) {
			console.log(`No push subscriptions found for user ${userId}`);
			return { sent: 0, failed: 0 };
		}

		const results = await Promise.allSettled(
			subscriptions.map((sub) => this.#sendPush(sub, payload))
		);

		let sent = 0;
		let failed = 0;

		for (let i = 0; i < results.length; i++) {
			const result = results[i];
			if (result.status === 'fulfilled') {
				sent++;
				// Update last used timestamp
				await this.#pushSubscriptionService.updateLastUsed(subscriptions[i].endpoint);
			} else {
				failed++;
				console.error(`Failed to send push to ${subscriptions[i].endpoint}:`, result.reason);
				// If subscription is expired/invalid, remove it
				if (this.#isSubscriptionError(result.reason)) {
					await this.#pushSubscriptionService.deleteById(subscriptions[i].id);
				}
			}
		}

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
	 */
	async #sendPush(subscription: SubscriptionData, payload: PushPayload) {
		const pushSubscription = {
			endpoint: subscription.endpoint,
			keys: {
				p256dh: subscription.p256dh,
				auth: subscription.auth
			}
		};

		const notificationPayload = JSON.stringify({
			title: payload.title,
			body: payload.body,
			icon: payload.icon || '/favicon.png',
			badge: payload.badge || '/favicon.png',
			data: payload.data || {}
		});

		return await webpush.sendNotification(pushSubscription, notificationPayload, {
			vapidDetails: {
				subject: this.#vapidSubject,
				publicKey: this.#vapidPublicKey,
				privateKey: this.#vapidPrivateKey
			}
		});
	}

	/**
	 * Check if error indicates subscription should be removed
	 */
	#isSubscriptionError(error: unknown): boolean {
		if (!error) return false;

		const statusCode = (error as { statusCode: number }).statusCode;
		// 404 = endpoint not found, 410 = subscription expired
		return statusCode === 404 || statusCode === 410;
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
