<script lang="ts">
	import PortalSidebar from '$lib/components/portal/PortalSidebar.svelte';
	let { data, children } = $props();
</script>

<div class="flex min-h-screen bg-gray-50">
	<PortalSidebar notifications={data.notifications} />

	<!-- Main content -->
	<div class="min-w-0 flex-1 lg:ml-64">
		<main class="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
			<div class="mx-auto max-w-5xl min-w-0">
				{@render children()}
			</div>
		</main>
	</div>
</div>
