<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import {
		isPushSupported,
		getNotificationPermission,
		requestNotificationPermission,
		subscribeToPush,
		unsubscribeFromPush,
		getCurrentSubscription
	} from '$lib/utils/push-notifications';
	import { env } from '$env/dynamic/public';
	import { toast } from 'svelte-sonner';
	import Button from '$lib/components/ui/Button.svelte';
	import { CircleCheck } from '@lucide/svelte';

	const PUBLIC_VAPID_PUBLIC_KEY = env.PUBLIC_VAPID_PUBLIC_KEY || '';

	let isSupported = $state(false);
	let isSubscribed = $state(false);
	let isLoading = $state(false);
	let permission = $state<NotificationPermission>('default');

	onMount(async () => {
		if (!browser) return;

		isSupported = isPushSupported();
		permission = getNotificationPermission();

		// Check if already subscribed
		const subscription = await getCurrentSubscription();
		isSubscribed = subscription !== null;
	});

	async function handleEnableNotifications() {
		if (!isSupported) {
			toast.error('Push-varsler støttes ikke i denne nettleseren');
			return;
		}

		isLoading = true;

		try {
			// Request permission
			const newPermission = await requestNotificationPermission();
			permission = newPermission;

			if (newPermission !== 'granted') {
				toast.error('Du må gi tillatelse til å motta varsler');
				isLoading = false;
				return;
			}

			// Subscribe to push
			const subscription = await subscribeToPush(PUBLIC_VAPID_PUBLIC_KEY);

			if (!subscription) {
				toast.error('Kunne ikke abonnere på push-varsler');
				isLoading = false;
				return;
			}

			// Send subscription to server
			const response = await fetch('/api/push/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(subscription.toJSON())
			});

			if (!response.ok) {
				throw new Error('Failed to save subscription');
			}

			isSubscribed = true;
			toast.success('Push-varsler aktivert!');
		} catch (error) {
			console.error('Failed to enable push notifications:', error);
			toast.error('Kunne ikke aktivere push-varsler');
		} finally {
			isLoading = false;
		}
	}

	async function handleDisableNotifications() {
		isLoading = true;

		try {
			const subscription = await getCurrentSubscription();

			if (subscription) {
				// Unsubscribe from push
				await unsubscribeFromPush();

				// Remove subscription from server
				const response = await fetch('/api/push/unsubscribe', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ endpoint: subscription.endpoint })
				});

				if (!response.ok) {
					throw new Error('Failed to remove subscription');
				}
			}

			isSubscribed = false;
			toast.success('Push-varsler deaktivert');
		} catch (error) {
			console.error('Failed to disable push notifications:', error);
			toast.error('Kunne ikke deaktivere push-varsler');
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="border-portal-border bg-portal-card overflow-auto rounded-lg border p-4 sm:p-6">
	<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Push-varsler</h3>

	{#if !isSupported}
		<div class="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/30">
			<p class="text-sm text-yellow-800 dark:text-yellow-200">
				Push-varsler støttes ikke i denne nettleseren.
			</p>
		</div>
	{:else}
		<div class="space-y-4">
			<div class="flex items-start justify-between gap-4">
				<div class="flex-1">
					<p class="text-sm font-medium text-gray-900 dark:text-gray-100">
						Motta varsler i nettleseren
					</p>
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
						Få varsler direkte i nettleseren når du blir tildelt vakter eller andre viktige
						hendelser.
					</p>
				</div>
			</div>

			<div class="flex items-center gap-2">
				{#if isSubscribed}
					<Button
						intent="danger"
						size="sm"
						disabled={isLoading}
						onclick={handleDisableNotifications}
					>
						{isLoading ? 'Laster...' : 'Deaktiver varsler'}
					</Button>
					<div class="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
						<CircleCheck class="size-5" />
						<span>Aktivert</span>
					</div>
				{:else}
					<Button
						intent="primary"
						size="sm"
						disabled={isLoading}
						onclick={handleEnableNotifications}
					>
						{isLoading ? 'Laster...' : 'Aktiver varsler'}
					</Button>
					{#if permission === 'denied'}
						<div class="text-sm text-red-600 dark:text-red-400">
							Varsler er blokkert. Sjekk nettleserinnstillingene.
						</div>
					{/if}
				{/if}
			</div>

			<div class="space-y-3">
				<div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30">
					<h4 class="mb-2 text-sm font-medium text-blue-900 dark:text-blue-100">Om push-varsler</h4>
					<ul class="list-inside list-disc space-y-1 text-sm text-blue-800 dark:text-blue-200">
						<li>Du må gi tillatelse i nettleseren</li>
						<li>Fungerer selv når siden er lukket</li>
						<li>Kan deaktiveres når som helst</li>
						<li>Kun for innloggede brukere</li>
					</ul>
				</div>

				<div class="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/30">
					<h4 class="mb-2 text-sm font-medium text-orange-900 dark:text-orange-100">
						⚠️ Bruker du Brave?
					</h4>
					<p class="text-sm text-orange-800 dark:text-orange-200">
						Brave blokkerer push-varsler som standard. Du må aktivere "Use Google services for push
						messaging" i
						<code class="rounded bg-orange-100 px-1 dark:bg-orange-800"
							>brave://settings/privacy</code
						>
						og restarte nettleseren.
					</p>
				</div>
			</div>
		</div>
	{/if}
</div>
