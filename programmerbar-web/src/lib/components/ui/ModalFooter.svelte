<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
	};

	let { children }: Props = $props();
</script>

<footer
	class="dark:border-portal-border flex flex-row gap-3 border-t border-gray-300 pt-4 md:flex-col md:items-center md:justify-between"
>
	{@render children?.()}
</footer>
