<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title?: string;
		description?: string;
		children?: Snippet;
	};

	let { title, description, children }: Props = $props();
</script>

<header
	class="dark:border-portal-border flex flex-col gap-2 border-b border-gray-300 pb-4 text-center"
>
	{#if title}
		<h2 class="text-3xl font-semibold text-gray-900">{title}</h2>
	{/if}
	{#if description}
		<p class="text-gray-600">{description}</p>
	{/if}
	{@render children?.()}
</header>
