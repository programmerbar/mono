<script lang="ts">
	import '../tailwind.css';

	import { setUserContext } from '$lib/states/user.svelte';
	import { Toaster } from 'svelte-sonner';
	import { createThemeContext } from '$lib/states/theme.svelte';

	const { data, children } = $props();

	const userState = $state({
		current: data.user
	});

	$effect.pre(() => {
		userState.current = data.user;
	});

	createThemeContext();
	setUserContext(userState);
</script>

<Toaster richColors />
{@render children()}
