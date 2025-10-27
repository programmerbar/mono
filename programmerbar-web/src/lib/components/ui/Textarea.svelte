<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	type Props = HTMLTextareaAttributes;

	let { class: className, value = $bindable(), ...props }: Props = $props();
</script>

<textarea
	bind:value
	class={cn(
		'min-h-20 w-full resize-none rounded-lg border-2 border-input-border bg-input-background p-2 text-gray-900 placeholder:text-sm placeholder:text-gray-400 focus:border-border focus:outline-primary focus:ring-0 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-primary dark:focus:outline-primary',
		className
	)}
	{...props}
></textarea>
