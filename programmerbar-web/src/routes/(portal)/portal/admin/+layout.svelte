<script lang="ts">
	let { children } = $props();
</script>

<!-- Admin pages inherit the portal sidebar layout -->
<!-- We can add admin-specific styling or breadcrumbs here if needed -->
<div class="bg-background rounded-lg border border-gray-200 shadow-sm">
	<div class="p-6">
		{@render children()}
	</div>
</div>
