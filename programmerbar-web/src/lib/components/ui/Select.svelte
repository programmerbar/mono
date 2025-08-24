<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import { cn } from '$lib/cn';

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
		'border-border focus:border-border focus:outline-primary h-10 rounded-lg border-2 p-2 text-sm focus:ring-0',
		className
	)}
	{...props}
>
	{#each options as option (option.value)}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>
