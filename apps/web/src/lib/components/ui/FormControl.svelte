<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLDivElement>;

	let { class: className, children, ...props } = $props<Props>();
</script>

<div {...props} class={cn('flex flex-col gap-1', className)}>
	{#if children}
		{@render children()}
	{/if}
</div>
