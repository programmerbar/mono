<script lang="ts">
	import { X } from '@lucide/svelte';
	import { cn } from '$lib/cn';

	interface Props {
		name: string;
		color?: string | null;
		size?: 'sm' | 'md' | 'lg';
		removable?: boolean;
		onRemove?: () => void;
		class?: string;
	}

	let { name, color, size = 'md', removable = false, onRemove, class: className }: Props = $props();

	const sizeClasses = {
		sm: 'px-2 py-1 text-xs',
		md: 'px-3 py-1 text-sm',
		lg: 'px-4 py-2 text-base'
	};
</script>

<div
	class={cn(
		'inline-flex items-center gap-1 rounded-full font-medium',
		sizeClasses[size],
		className
	)}
	style="background-color: {color || '#E5E7EB'}20; color: {color || '#374151'}"
>
	<span>{name}</span>
	{#if removable && onRemove}
		<button type="button" onclick={onRemove} class="ml-1 transition-colors hover:text-red-600">
			<X class={size === 'sm' ? 'size-3' : size === 'md' ? 'size-4' : 'size-5'} />
		</button>
	{/if}
</div>
