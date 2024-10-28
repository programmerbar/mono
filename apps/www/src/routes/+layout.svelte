<script lang="ts">
	import { setAuthContext } from '$lib/context/user.context';
	import { Toaster } from 'svelte-sonner';
	import '../tailwind.css';

	const { data, children } = $props();

	setAuthContext({
		get user() {
			return data.user;
		}
	});
</script>

<Toaster />
{@render children()}
