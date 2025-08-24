<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/cn';

	type Props = HTMLInputAttributes & {
		checked?: boolean;
		label?: string;
	};

	let { class: className, checked = $bindable(false), label, id, ...props }: Props = $props();
</script>

<div class="flex items-center justify-between py-2">
	{#if label}
		<label for={id} class="text-sm font-semibold">{label}</label>
	{/if}
	<input
		{id}
		type="checkbox"
		bind:checked
		class={cn('h-4 w-4 rounded border-2', className)}
		{...props}
	/>
</div>
