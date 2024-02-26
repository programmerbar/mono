<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/cn';

	type Props = HTMLInputAttributes;

	let { class: className, ...props } = $props<Props>();
</script>

<input {...props} class={cn('h-10 rounded-md px-2 border shadow bg-gray-100', className)} />
