<script lang="ts">
	import { cn } from '$lib/cn';

	type Props = {
		text: string;
		depth: 1 | 2 | 3 | 4 | 5 | 6;
	};

	let { text, depth }: Props = $props();

	const Tag = `h${depth}` as const;
</script>

<svelte:element
	this={Tag}
	class={cn({
		'text-4xl': depth === 1,
		'text-3xl': depth === 2,
		'text-2xl': depth === 3,
		'text-xl': depth === 4,
		'text-lg': depth === 5,
		'text-base': depth === 6,
		'font-bold': depth <= 2,
		'font-medium': depth > 2
	})}
>
	{text}
</svelte:element>
