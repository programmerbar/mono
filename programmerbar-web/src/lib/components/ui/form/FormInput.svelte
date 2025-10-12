<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Input from '../Input.svelte';

	type Props = HTMLInputAttributes & {
		label?: string;
		description?: string;
		error?: string;
	};

	let {
		label,
		class: className,
		value = $bindable(),
		description = $bindable(),
		error = $bindable(),
		...props
	}: Props = $props();
</script>

<label class="flex flex-col gap-1">
	{#if label}
		<span class="text-sm font-medium">{label}</span>
	{/if}

	<Input bind:value class={className} {...props} />

	{#if description}
		<span class="text-sm text-gray-500">{description}</span>
	{/if}

	{#if error}
		<span class="text-sm text-red-500">{error}</span>
	{/if}
</label>
