<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { TrainingItem } from '$lib/constants/training';
	import { DEFAULT_TRAINING_ITEMS } from '$lib/constants/training';
	import {
		calculateCompletionStatus,
		groupTrainingItemsByCategory,
		toggleItemCompletion,
		fetchTrainingData
	} from '$lib/utils/training';
	import type { CompletionStatus } from '$lib/utils/training';
	import TrainingItemComponent from './TrainingItem.svelte';
	import TrainingProgress from './TrainingProgress.svelte';
	import TrainingActions from './TrainingActions.svelte';

	interface Props {
		userId?: string | number | null;
		isOpen: boolean;
		userName?: string;
		onclose?: () => void;
		onsave?: (data: {
			userId: string | number;
			items: TrainingItem[];
			completionStatus: CompletionStatus;
		}) => void;
	}

	let { userId = null, isOpen = false, userName = 'bruker', onclose, onsave }: Props = $props();

	let trainingItems = $state<TrainingItem[]>([...DEFAULT_TRAINING_ITEMS]);
	let isSaving = $state(false);

	let isTrainingMode = $derived(userId !== null && userId !== undefined);
	let modalTitle = $derived(isTrainingMode ? `Opplæring for ${userName}` : 'Opplæringsliste');
	let modalDescription = $derived(
		isTrainingMode
			? 'Marker av hvert punkt etter som opplæringen blir fullført'
			: 'Oversikt over alle opplæringspunkter som må gjennomgås'
	);

	let groupedTrainingItems = $derived(groupTrainingItemsByCategory(trainingItems));
	let completionStatus = $derived(calculateCompletionStatus(trainingItems));

	$effect(() => {
		if (isTrainingMode && isOpen) {
			(async () => {
				try {
					const fetchedData = await fetchTrainingData(userId as string | number);
					trainingItems = fetchedData.length > 0 ? fetchedData : [...DEFAULT_TRAINING_ITEMS];
				} catch (error) {
					console.error('Failed to load training data:', error);
					trainingItems = [...DEFAULT_TRAINING_ITEMS];
				}
			})();
		} else if (!isTrainingMode) {
			trainingItems = [...DEFAULT_TRAINING_ITEMS];
		}
	});

	function toggleTrainingItem(itemId: number) {
		if (!isTrainingMode) return;
		trainingItems = toggleItemCompletion(trainingItems, itemId);
	}

	function handleSave() {
		if (!isTrainingMode || !completionStatus.isComplete) return;

		isSaving = true;
		const form = document.getElementById('trainingForm') as HTMLFormElement;
		if (form) {
			form.requestSubmit();
		}
	}

	function handleClose() {
		if (onclose) {
			onclose();
		}
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="mx-4 max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
			<div class="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
				<h3 class="text-lg font-semibold text-gray-900">{modalTitle}</h3>
				<p class="text-sm text-gray-600">{modalDescription}</p>
			</div>

			<div class="p-6">
				<div class="space-y-6">
					{#each Object.entries(groupedTrainingItems) as [category, items] (category)}
						<div class="space-y-3">
							<h3 class="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-800">
								{category}
							</h3>
							<div class="space-y-3">
								{#each items as item (item.id)}
									<TrainingItemComponent
										{item}
										{isTrainingMode}
										{isSaving}
										onToggle={toggleTrainingItem}
									/>
								{/each}
							</div>
						</div>
					{/each}
				</div>

				<TrainingProgress {completionStatus} {isTrainingMode} />
			</div>

			<TrainingActions
				{completionStatus}
				{isTrainingMode}
				{isSaving}
				onClose={handleClose}
				onSave={handleSave}
			/>
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
								if (onsave && userId !== null) {
									onsave({ userId, items: trainingItems, completionStatus });
								}
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
