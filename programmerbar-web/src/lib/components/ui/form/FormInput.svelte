<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Input from '../Input.svelte';

	type Props = HTMLInputAttributes & {
		label?: string;
		description?: string;
	};

	let { label, description, class: className, value = $bindable(), ...props }: Props = $props();
</script>

<label class="flex flex-col gap-1">
	{#if label}
		<span class="text-sm font-medium">{label}</span>
	{/if}

	<Input bind:value class={className} {...props} />

	{#if description}
		<span class="text-sm text-gray-500">{description}</span>
	{/if}
</label>
