<script lang="ts">
	import PortalSidebar from '$lib/components/portal/PortalSidebar.svelte';
	import { createThemeContext } from '$lib/states/theme.svelte.js';
	import { onMount } from 'svelte';

	let { data, children } = $props();

	// Initialize theme context for portal
	createThemeContext();

	// Ensure body dark class is removed when leaving portal
	onMount(() => {
		return () => {
			// Cleanup: remove dark class from body when leaving portal
			document.body.classList.remove('dark');
		};
	});
</script>

<div id="portal-layout" class="bg-portal-background flex min-h-screen">
	<PortalSidebar
		notifications={data.notifications}
		pendingApplicationsCount={data.pendingApplicationsCount}
	/>

	<div class="min-w-0 flex-1 lg:ml-64">
		<main class="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
			<div class="mx-auto max-w-5xl min-w-0">
				{@render children()}
			</div>
		</main>
	</div>
</div>
