<script lang="ts">
	import TagBadge from './TagBadge.svelte';
	import { cn } from '$lib/cn';

	interface Tag {
		id: string;
		name: string;
		color?: string | null;
	}

	interface Props {
		tags: Tag[];
		size?: 'sm' | 'md' | 'lg';
		removable?: boolean;
		onRemove?: (tagId: string) => void;
		emptyText?: string;
		class?: string;
	}

	let {
		tags,
		size = 'md',
		removable = false,
		onRemove,
		emptyText = 'No tags assigned',
		class: className
	}: Props = $props();
</script>

<div class={cn('flex flex-wrap gap-2', className)}>
	{#each tags as tag (tag.id)}
		<TagBadge
			name={tag.name}
			color={tag.color}
			{size}
			{removable}
			onRemove={removable && onRemove ? () => onRemove(tag.id) : undefined}
		/>
	{:else}
		<span class="text-sm text-gray-500">{emptyText}</span>
	{/each}
</div>
