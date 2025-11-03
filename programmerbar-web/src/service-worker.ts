/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />

import { build, files, version } from '$service-worker';

const self = globalThis.self as unknown as ServiceWorkerGlobalScope;

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
	console.log('[Service Worker] Install event');

	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	console.log('[Service Worker] Activate event');

	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
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
		self.registration.pushManager.subscribe(event.oldSubscription?.options).then((subscription) => {
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

self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);

			if (response) {
				return response;
			}
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);

			// if we're offline, fetch can return a value that is not a Response
			// instead of throwing - and we can't pass this non-Response to respondWith
			if (!(response instanceof Response)) {
				throw new Error('invalid response from fetch');
			}

			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch (err) {
			const response = await cache.match(event.request);

			if (response) {
				return response;
			}

			// if there's no cache, then just error out
			// as there is nothing we can do to respond to this request
			throw err;
		}
	}

	event.respondWith(respond());
});
