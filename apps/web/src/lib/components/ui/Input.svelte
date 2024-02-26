<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/cn';

	type Props = HTMLInputAttributes;

	let { class: className, ...props } = $props<Props>();
</script>

<input {...props} class={cn('h-10 rounded-md px-2 border-2 border-black shadow', className)} />
