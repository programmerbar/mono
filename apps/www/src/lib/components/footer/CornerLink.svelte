<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		href: string;
		isExternal?: boolean;
		when?: boolean;
		children: Snippet;
	};

	let { href, isExternal = false, when = true, children }: Props = $props();
	let target = isExternal ? '_blank' : undefined;
</script>

{#if when}
	<a class="hover:underline" {href} {target}>
		{@render children()}
	</a>
{/if}
