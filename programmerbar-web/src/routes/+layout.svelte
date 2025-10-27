<script lang="ts">
	import '../tailwind.css';

	import { setUserContext } from '$lib/states/user';
	import { Toaster } from 'svelte-sonner';
	import { writable } from 'svelte/store';
	import { registerServiceWorker } from '$lib/utils/push-notifications';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	const { data, children } = $props();

	const user = writable(data.user);
	$effect.pre(() => {
		user.set(data.user);
	});
	setUserContext(user);

	// Register service worker for push notifications
	onMount(() => {
		if (browser) {
			registerServiceWorker();
		}
	});
</script>

<Toaster richColors />
{@render children()}
