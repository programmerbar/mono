<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { cn } from '$lib/cn';

	type Props = HTMLTextareaAttributes;

	let { class: className, value = $bindable(), ...props }: Props = $props();
</script>

<textarea
	bind:value
	class={cn(
		'border-border focus:border-border focus:outline-primary min-h-20 w-full resize-none rounded-lg border p-2 placeholder:text-sm focus:ring-0',
		className
	)}
	{...props}
></textarea>