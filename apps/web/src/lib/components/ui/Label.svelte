<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import { cn } from '$lib/cn';

	type Props = HTMLLabelAttributes & {
		children: Snippet;
		required?: boolean;
	};

	let { class: className, for: htmlFor, children, required, ...props }: Props = $props();
</script>

<label {...props} for={htmlFor} class={cn('font-medium', className)}>
	{@render children()}
	{#if required}
		<span class="text-red-500">*</span>
	{/if}
</label>
