<script lang="ts">
	import '../tailwind.css';

	import { setUserContext } from '$lib/states/user.svelte';
	import { Toaster } from 'svelte-sonner';
	import { registerServiceWorker } from '$lib/utils/push-notifications';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	const { data, children } = $props();

	const userState = $state({
		current: data.user
	});

	$effect.pre(() => {
		userState.current = data.user;
	});

	setUserContext(userState);

	// Register service worker for push notifications
	onMount(() => {
		if (browser) {
			registerServiceWorker();
		}
	});
</script>

<Toaster richColors />
{@render children()}
