<script lang="ts">
	let { children } = $props();
</script>

<!-- Admin pages inherit the portal sidebar layout -->
<!-- We can add admin-specific styling or breadcrumbs here if needed -->
<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
	<div class="p-6">
		{@render children()}
	</div>
</div>
