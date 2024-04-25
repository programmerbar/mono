<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/cn';

	type Props = {
		href: string;
		active?: boolean;
		class?: string;
		children: Snippet;
	};

	let { href, children, active = false, class: className }: Props = $props();
</script>

<a
	class={cn(
		'flex w-full px-4 items-center rounded-lg gap-2 hover:bg-gray-200 h-10 transition-all',
		{
			'bg-gray-200': active
		},
		className
	)}
	{href}>{@render children()}</a
>
