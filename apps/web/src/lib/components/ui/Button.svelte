<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$lib/cn';

	type Props = HTMLButtonAttributes & {
		children: Snippet;
	};

	let { class: className, children, ...props }: Props = $props();
</script>

<button
	type="button"
	{...props}
	class={cn(
		'bg-primary rounded py-2 px-4 font-medium border-2 border-black h-10 flex justify-center items-center shadow-xl hover:bg-yellow-100 transition-colors',
		className
	)}
>
	{@render children()}
</button>
