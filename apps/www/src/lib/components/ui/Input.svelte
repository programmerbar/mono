<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/cn';

	type Props = HTMLInputAttributes;

	let { class: className, value = $bindable(), ...props }: Props = $props();
</script>

<input
	bind:value
	class={cn(
		'border-border focus:border-border focus:outline-primary h-10 rounded-lg border p-2 placeholder:text-sm focus:ring-0',
		className
	)}
	{...props}
/>
