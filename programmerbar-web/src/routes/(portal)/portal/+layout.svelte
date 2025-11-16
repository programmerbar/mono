<script lang="ts">
	import PortalSidebar from '$lib/components/portal/PortalSidebar.svelte';

	let { data, children } = $props();
</script>

<div id="portal-layout" class="bg-portal-background flex min-h-screen">
	<PortalSidebar
		notifications={data.notifications}
		pendingApplicationsCount={data.pendingApplicationsCount}
	/>

	<div class="min-w-0 flex-1 lg:ml-80">
		<main class="mb-32 min-w-0 flex-1 p-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
			<div class="mx-auto max-w-5xl min-w-0 py-10">
				{@render children()}
			</div>
		</main>

		<footer class="dark:border-portal-border border-t border-gray-200 p-20 text-center">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Har du problemer med siden? Ta kontakt med <a
					href="mailto:web@programmerbar.no"
					class="text-primary hover:underline">web@programmerbar.no</a
				>
			</p>
		</footer>
	</div>
</div>
