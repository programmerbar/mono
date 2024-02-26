<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$lib/cn';

	type Props = HTMLButtonAttributes & {
		children: Snippet;
	};

	let { class: className, children, ...props } = $props<Props>();
</script>

<button
	type="button"
	{...props}
	class={cn(
		'bg-yellow-200 rounded-md py-2 px-4 font-medium border-2 border-black h-10 inline-flex justify-center items-center shadow hover:bg-yellow-300 transition-colors',
		className
	)}
>
	{@render children()}
</button>
