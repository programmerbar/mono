<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/cn';

	type Props = HTMLInputAttributes;

	let { class: className, value = $bindable(), ...props }: Props = $props();
</script>

<input
	bind:value
	class={cn(
		'h-10 rounded-lg border border-border p-2 placeholder:text-sm focus:border-border focus:outline-primary focus:ring-0',
		className
	)}
	{...props}
/>
