<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	type Props = HTMLInputAttributes & {
		checked?: boolean;
		label?: string;
	};

	let { class: className, checked = $bindable(false), label, id, ...props }: Props = $props();
</script>

<div class="flex items-center justify-between py-2">
	{#if label}
		<label for={id} class="text-sm font-semibold dark:text-gray-200">{label}</label>
	{/if}
	<input
		{id}
		type="checkbox"
		bind:checked
		class={cn(
			'dark:checked:bg-primary dark:checked:border-primary h-4 w-4 rounded border-2 dark:border-slate-600 dark:bg-slate-800',
			className
		)}
		{...props}
	/>
</div>
