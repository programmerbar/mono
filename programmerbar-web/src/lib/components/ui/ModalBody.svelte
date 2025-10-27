<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
	};

	let { children }: Props = $props();
</script>

<div class="flex-1 overflow-y-auto px-0 py-4">
	{@render children?.()}
</div>
