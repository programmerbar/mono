<script lang="ts">
	import '../tailwind.css';

	import { setUserContext } from '$lib/context/user.context';
	import { Toaster } from 'svelte-sonner';
	import { writable } from 'svelte/store';

	const { data, children } = $props();

	const user = writable(data.user);
	$effect.pre(() => {
		user.set(data.user);
	});
	setUserContext(user);
</script>

<Toaster richColors />
{@render children()}
