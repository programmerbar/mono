<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/cn';

	type Props = HTMLInputAttributes;

	let { class: className, value = $bindable(), ...props }: Props = $props();
</script>

<input
	bind:value
	class={cn(
		'border-border focus:border-border focus:outline-primary dark:focus:border-primary dark:focus:outline-primary h-10 rounded-lg border-2 bg-white p-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 dark:placeholder:text-gray-500',
		className
	)}
	{...props}
/>
