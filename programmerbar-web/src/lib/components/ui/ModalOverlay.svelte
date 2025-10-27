<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		open: boolean;
		children?: Snippet;
	};

	let { open, children }: Props = $props();
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-6">
		{@render children?.()}
	</div>
{/if}
