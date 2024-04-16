<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';

	const { children } = $props();
</script>

<Toaster richColors />
{@render children()}
