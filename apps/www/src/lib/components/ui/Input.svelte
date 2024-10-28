<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/cn';

	type Props = HTMLInputAttributes;

	let { class: className, value = $bindable(), ...props }: Props = $props();
</script>

<input
	bind:value
	class={cn(
		'border border-border placeholder:text-sm focus:outline-primary focus:ring-0 focus:border-border rounded-lg p-2 h-10',
		className
	)}
	{...props}
/>
