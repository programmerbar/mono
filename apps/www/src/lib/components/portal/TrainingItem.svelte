<script lang="ts">
	import type { TrainingItem } from '$lib/constants/training';

	interface Props {
		item: TrainingItem;
		isTrainingMode: boolean;
		isSaving: boolean;
		onToggle: (itemId: number) => void;
	}

	let { item, isTrainingMode, isSaving, onToggle }: Props = $props();

	function handleToggle() {
		if (isTrainingMode && !isSaving) {
			onToggle(item.id);
		}
	}
</script>

<div
	class="flex items-start gap-3 rounded-lg border p-3 transition-all duration-200 {item.completed
		? 'border-green-200 bg-green-50'
		: 'border-gray-200 bg-gray-50'} {isTrainingMode ? 'hover:border-gray-300' : ''}"
>
	<button
		class="mt-1 flex-shrink-0 {isTrainingMode ? 'cursor-pointer' : 'cursor-default'}"
		onclick={handleToggle}
		disabled={!isTrainingMode || isSaving}
		aria-label={item.completed ? 'Marker som ikke fullført' : 'Marker som fullført'}
	>
		<div
			class="flex h-5 w-5 items-center justify-center rounded border-2 {item.completed
				? 'border-green-500 bg-green-500'
				: isTrainingMode
					? 'border-gray-300 hover:border-gray-400'
					: 'border-gray-300'} transition-colors"
		>
			{#if item.completed}
				<svg
					class="h-3 w-3 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"
					></path>
				</svg>
			{/if}
		</div>
	</button>

	<div class="flex-1">
		<h4
			class="font-medium text-gray-900 transition-all duration-200 {item.completed
				? 'text-gray-500 line-through'
				: ''}"
		>
			{item.title}
		</h4>
		<p
			class="text-sm text-gray-600 transition-all duration-200 {item.completed
				? 'text-gray-400 line-through'
				: ''}"
		>
			{item.description}
		</p>
	</div>
</div>
