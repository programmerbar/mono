<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$lib/cn';

	type Props = HTMLButtonAttributes;

	let { class: className, children, ...props }: Props = $props();
</script>

<button
	class={cn(
		'flex items-center justify-center border border-border rounded-lg py-2 font-medium px-4 h-10 transition-all text-gray-700 hover:bg-gray-200 hover:border-gray-400',
		className
	)}
	{...props}
>
	{@render children?.()}
</button>
