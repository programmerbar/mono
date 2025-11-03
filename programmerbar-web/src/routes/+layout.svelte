<script lang="ts">
	import '../tailwind.css';

	import { setUserContext } from '$lib/states/user.svelte';
	import { Toaster } from 'svelte-sonner';

	const { data, children } = $props();

	const userState = $state({
		current: data.user
	});

	$effect.pre(() => {
		userState.current = data.user;
	});

	setUserContext(userState);
</script>

<Toaster richColors />
{@render children()}
