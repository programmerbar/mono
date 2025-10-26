// Service Worker for handling push notifications

const CACHE_NAME = 'programmerbar-v1';

self.addEventListener('install', () => {
	console.log('[Service Worker] Installing...');
	self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
	console.log('[Service Worker] Activating...');
	event.waitUntil(self.clients.claim());
});

// Push event -> show notification
self.addEventListener('push', (event) => {
	console.log('[Service Worker] Push received:', event);

	let data = {
		title: 'Programmerbar',
		body: 'Du har en ny notifikasjon',
		icon: '/android-chrome-192x192.png',
		badge: '/favicon-32x32.png',
		data: {}
	};

	if (event.data) {
		try {
			data = event.data.json();
		} catch (e) {
			console.error('[Service Worker] Failed to parse push data:', e);
		}
	}

	const options = {
		body: data.body,
		icon: data.icon || '/android-chrome-192x192.png',
		badge: data.badge || '/favicon-32x32.png',
		vibrate: [200, 100, 200],
		tag: 'programmerbar-notification',
		requireInteraction: false,
		data: data.data || {}
	};

	event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click event -> navigate to app
self.addEventListener('notificationclick', (event) => {
	console.log('[Service Worker] Notification clicked:', event);

	event.notification.close();

	const urlToOpen = new URL('/portal/notifikasjoner', self.location.origin).href;

	event.waitUntil(
		self.clients
			.matchAll({
				type: 'window',
				includeUncontrolled: true
			})
			.then((clientList) => {
				// Check if there's already a window open
				for (const client of clientList) {
					if (client.url === urlToOpen && 'focus' in client) {
						return client.focus();
					}
				}
				// If no window is open, open a new one
				if (self.clients.openWindow) {
					return self.clients.openWindow(urlToOpen);
				}
			})
	);
});

// Handle subscription changes
self.addEventListener('pushsubscriptionchange', (event) => {
	console.log('[Service Worker] Push subscription changed');

	event.waitUntil(
		self.registration.pushManager.subscribe(event.oldSubscription.options).then((subscription) => {
			console.log('[Service Worker] Resubscribed:', subscription);
			return fetch('/api/push/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(subscription.toJSON())
			});
		})
	);
});
