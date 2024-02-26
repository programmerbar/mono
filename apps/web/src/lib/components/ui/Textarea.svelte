<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { cn } from '$lib/cn';

	type Props = HTMLTextareaAttributes;

	let { class: className, ...props } = $props<Props>();
</script>

<textarea {...props} class={cn('rounded-md p-2 border-2 border-black shadow', className)} />
