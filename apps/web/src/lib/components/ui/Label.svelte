<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import { cn } from '$lib/cn';

	type Props = HTMLLabelAttributes & {
		children: Snippet;
	};

	let { class: className, for: htmlFor, children, ...props } = $props<Props>();
</script>

<label {...props} for={htmlFor} class={cn('font-medium', className)}>
	{@render children()}
</label>
