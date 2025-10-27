<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	type Props = HTMLInputAttributes;

	let { class: className, value = $bindable(), ...props }: Props = $props();
</script>

<input
	bind:value
	class={cn(
		'h-10 rounded-lg border-2 border-input-border bg-input-background p-2 text-gray-900 placeholder:text-gray-400 focus:border-border focus:outline-primary focus:ring-0 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-primary dark:focus:outline-primary',
		className
	)}
	{...props}
/>
