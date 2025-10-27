<script lang="ts">
	import PortalSidebar from '$lib/components/portal/PortalSidebar.svelte';
	import { createThemeContext } from '$lib/states/theme.svelte.js';

	let { data, children } = $props();

	// Initialize theme context for portal
	createThemeContext();
</script>

<div id="portal-layout" class="flex min-h-screen bg-gray-50 dark:bg-slate-900">
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
