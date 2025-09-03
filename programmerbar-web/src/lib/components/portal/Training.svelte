<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { TrainingItem } from '$lib/constants/training';
	import { DEFAULT_TRAINING_ITEMS, TRAINING_CATEGORIES } from '$lib/constants/training';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		userId?: string | number | null;
		isOpen: boolean;
		userName?: string;
		onclose?: () => void;
		onsave?: (data: { completionStatus: { isComplete: boolean } }) => void;
	}

	let { userId = null, isOpen = false, userName = 'bruker', onclose, onsave }: Props = $props();

	let trainingItems = $state<TrainingItem[]>([...DEFAULT_TRAINING_ITEMS]);
	let isSaving = $state(false);

	let isTrainingMode = $derived(userId !== null && userId !== undefined);
	let completedCount = $derived(trainingItems.filter((item) => item.completed).length);
	let totalCount = $derived(trainingItems.length);
	let isComplete = $derived(completedCount === totalCount);
	let progressPercentage = $derived(
		totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
	);

	$effect(() => {
		if (isOpen) {
			trainingItems = [...DEFAULT_TRAINING_ITEMS];
		}
	});

	function toggleItem(itemId: number) {
		if (!isTrainingMode) return;
		trainingItems = trainingItems.map((item) =>
			item.id === itemId ? { ...item, completed: !item.completed } : item
		);
	}

	function handleSave() {
		if (!isComplete) return;
		isSaving = true;
		const form = document.getElementById('trainingForm') as HTMLFormElement;
		if (form) {
			form.requestSubmit();
		}
	}

	function handleClose() {
		onclose?.();
	}

	const groupedItems = $derived(
		Object.values(TRAINING_CATEGORIES).reduce(
			(acc, category) => {
				acc[category] = trainingItems.filter((item) => item.category === category);
				return acc;
			},
			{} as Record<string, TrainingItem[]>
		)
	);
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs">
		<div class="mx-4 max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
			<div class="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
				<h3 class="text-lg font-semibold text-gray-900">
					{isTrainingMode ? `Opplæring for ${userName}` : 'Opplæringsliste'}
				</h3>
				<p class="text-sm text-gray-600">
					{isTrainingMode
						? 'Marker av hvert punkt etter som opplæringen blir fullført'
						: 'Oversikt over alle opplæringspunkter som må gjennomgås'}
				</p>
			</div>

			<div class="p-6">
				<div class="space-y-6">
					{#each Object.entries(groupedItems) as [category, items] (category)}
						<div class="space-y-3">
							<h3 class="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-800">
								{category}
							</h3>
							<div class="space-y-3">
								{#each items as item (item.id)}
									{#if isTrainingMode}
										<label
											class="flex cursor-pointer items-start space-x-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
										>
											<input
												type="checkbox"
												checked={item.completed}
												onchange={() => toggleItem(item.id)}
												disabled={isSaving}
												class="mt-1 h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
											/>
											<div class="flex-1">
												<h4 class="text-sm font-medium text-gray-900">{item.title}</h4>
												<p class="text-xs text-gray-500">{item.description}</p>
											</div>
										</label>
									{:else}
										<div class="flex items-start space-x-3 rounded-lg border border-gray-200 p-3">
											<div class="mt-1 h-5 w-5 rounded border border-gray-300"></div>
											<div class="flex-1">
												<h4 class="text-sm font-medium text-gray-900">{item.title}</h4>
												<p class="text-xs text-gray-500">{item.description}</p>
											</div>
										</div>
									{/if}
								{/each}
							</div>
						</div>
					{/each}
				</div>

				{#if isTrainingMode}
					<div class="mt-6 rounded-lg bg-gray-50 p-4">
						<div class="flex items-center justify-between">
							<span class="text-sm font-medium text-gray-700">Fremgang</span>
							<span class="text-sm text-gray-500">{completedCount} / {totalCount}</span>
						</div>
						<div class="mt-2 h-2 w-full rounded-full bg-gray-200">
							<div
								class="h-2 rounded-full bg-blue-600 transition-all duration-300"
								style="width: {progressPercentage}%"
							></div>
						</div>
					</div>
				{/if}
			</div>

			<div class="border-t border-gray-200 px-6 py-4">
				<div class="flex justify-end space-x-3">
					<Button type="button" onclick={handleClose} intent="outline" disabled={isSaving}>
						{isTrainingMode ? 'Avbryt' : 'Lukk'}
					</Button>
					{#if isTrainingMode}
						<Button
							type="button"
							onclick={handleSave}
							intent="primary"
							disabled={!isComplete || isSaving}
						>
							{isSaving ? 'Lagrer...' : 'Fullfør opplæring'}
						</Button>
					{/if}
				</div>
			</div>
		</div>

		{#if isTrainingMode}
			<form
				id="trainingForm"
				method="POST"
				action="?/completeTraining"
				style="display: none;"
				use:enhance={() => {
					return async ({ result }) => {
						isSaving = false;
						if (result.type === 'success') {
							const data = result.data as { trainingCompleted?: boolean } | undefined;
							if (data?.trainingCompleted) {
								await invalidateAll();
								onsave?.({ completionStatus: { isComplete: true } });
							}
						} else if (result.type === 'failure') {
							const data = result.data as { error?: string } | undefined;
							console.error('Failed to complete training:', data?.error);
						}
					};
				}}
			>
				<input type="hidden" name="userId" value={userId?.toString() || ''} />
				<input type="hidden" name="trainingData" value={JSON.stringify(trainingItems)} />
			</form>
		{/if}
	</div>
{/if}
