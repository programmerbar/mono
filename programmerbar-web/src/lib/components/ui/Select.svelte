<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	type Option = {
		value: string;
		label: string;
	};

	type Props = HTMLSelectAttributes & {
		options: Array<Option>;
		value?: string;
	};

	let { class: className, options, value = $bindable(), ...props }: Props = $props();
</script>

<select
	bind:value
	class={cn(
		'h-10 rounded-lg border-2 border-input-border bg-input-background p-2 text-sm text-gray-900 focus:border-border focus:outline-primary focus:ring-0 dark:text-gray-100',
		className
	)}
	{...props}
>
	{#each options as option (option.value)}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>
