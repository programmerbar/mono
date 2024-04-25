<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/cn';

	type Props = {
		href: string;
		class?: string;
		children: Snippet;
	};

	let { href, children, class: className }: Props = $props();
	let active = $derived($page.url.pathname === href);
</script>

<a
	class={cn(
		'flex w-full px-4 items-center rounded-lg gap-2 hover:bg-gray-200 h-10 transition-all',
		{
			'bg-gray-200 font-medium': active
		},
		className
	)}
	{href}>{@render children()}</a
>
