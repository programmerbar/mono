<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { cn } from '$lib/cn';

	type Props = HTMLTextareaAttributes;

	let { class: className, ...props }: Props = $props();
</script>

<textarea {...props} class={cn('rounded-md p-2 border-border border-2 shadow', className)}>
</textarea>
