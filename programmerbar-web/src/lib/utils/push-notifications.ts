/**
 * Check if push notifications are supported
 */
export function isPushSupported(): boolean {
	return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/**
 * Check current notification permission
 */
export function getNotificationPermission(): NotificationPermission {
	if (!('Notification' in window)) {
		return 'denied';
	}
	return Notification.permission;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
	if (!('Notification' in window)) {
		return 'denied';
	}

	const permission = await Notification.requestPermission();
	return permission;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPush(vapidPublicKey: string): Promise<PushSubscription | null> {
	try {
		// Ensure service worker is ready
		const registration = await navigator.serviceWorker.ready;

		// Check if already subscribed
		const existingSubscription = await registration.pushManager.getSubscription();
		if (existingSubscription) {
			console.log('Already subscribed to push notifications');
			return existingSubscription;
		}

		// Subscribe to push
		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: vapidPublicKey
		});

		console.log('Subscribed to push notifications:', subscription);
		return subscription;
	} catch (error) {
		console.error('Failed to subscribe to push notifications:', error);
		return null;
	}
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(): Promise<boolean> {
	try {
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();

		if (!subscription) {
			console.log('No active subscription to unsubscribe from');
			return true;
		}

		const result = await subscription.unsubscribe();
		console.log('Unsubscribed from push notifications:', result);
		return result;
	} catch (error) {
		console.error('Failed to unsubscribe from push notifications:', error);
		return false;
	}
}

/**
 * Get current push subscription
 */
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
	try {
		const registration = await navigator.serviceWorker.ready;
		return await registration.pushManager.getSubscription();
	} catch (error) {
		console.error('Failed to get current subscription:', error);
		return null;
	}
}
