<script lang="ts">
	interface TrainingItem {
		id: number;
		title: string;
		description: string;
		completed: boolean;
	}

	interface Props {
		userId?: string | number | null;
		isOpen: boolean;
		userName?: string;
		onclose?: () => void;
		onsave?: (data: { userId: string | number; items: TrainingItem[]; completionStatus: { completedCount: number; totalCount: number; isComplete: boolean } }) => void;
	}

	let { 
		userId = null, 
		isOpen = false, 
		userName = "bruker",
		onclose,
		onsave
	}: Props = $props();

	const defaultTrainingItems = [
		{ id: 1, title: 'Sikkerhetsprosedyrer', description: 'Kjennskap til nødutganger og sikkerhetstiltak', completed: false },
		{ id: 2, title: 'Kassasystem', description: 'Betjening av kasse og betalingsløsninger', completed: false },
		{ id: 3, title: 'Produktkjennskap', description: 'Oversikt over øl, mat og priser', completed: false },
		{ id: 4, title: 'Kundeservice', description: 'Håndtering av kunder og konfliktsituasjoner', completed: false },
		{ id: 5, title: 'Oppstilling og nedrigging', description: 'Prosedyrer for start og slutt av arrangement', completed: false },
		{ id: 6, title: 'Kommunikasjon', description: 'Bruk av radio/kommunikasjonssystemer', completed: false }
	];

	let trainingItems = $state([...defaultTrainingItems]);
	let isSaving = $state(false);
	let isLoading = $state(false);

	let isTrainingMode = $derived(userId !== null && userId !== undefined);
	let modalTitle = $derived(isTrainingMode ? `Opplæring for ${userName}` : 'Opplæringsliste');
	let modalDescription = $derived(isTrainingMode 
		? 'Marker av hvert punkt etter som opplæringen blir fullført'
		: 'Oversikt over alle opplæringspunkter som må gjennomgås');

	$effect(async () => {
		if (isTrainingMode && isOpen) {
			isLoading = true;
			try {
				const response = await fetch(`/api/training/${userId}`);
				if (response.ok) {
					const userData = await response.json();
					trainingItems = userData.trainingData || [...defaultTrainingItems];
				} else {
					// If no data exists, start with default items
					trainingItems = [...defaultTrainingItems];
				}
			} catch (error) {
				console.error('Failed to load training data:', error);
				trainingItems = [...defaultTrainingItems];
			} finally {
				isLoading = false;
			}
		} else if (!isTrainingMode) {
			// In reference mode, always show default unchecked items
			trainingItems = [...defaultTrainingItems];
		}
	});

	function getCompletionStatus() {
		const completedCount = trainingItems.filter(item => item.completed).length;
		const totalCount = trainingItems.length;
		return { completedCount, totalCount, isComplete: completedCount === totalCount };
	}

	function toggleTrainingItem(itemId: number) {
		// Only allow toggling in training mode
		if (!isTrainingMode) return;
		
		const item = trainingItems.find(item => item.id === itemId);
		if (item) {
			item.completed = !item.completed;
		}
	}

	async function handleSave() {
		if (!isTrainingMode) return;
		
		const completionStatus = getCompletionStatus();
		if (!completionStatus.isComplete) {
			// Don't save if not complete - they need to finish everything
			return;
		}
		
		isSaving = true;
		
		try {
			// For now, just simulate a save
			// Later you can add your actual API call here
			await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
			
			// Uncomment when you have your API ready:
			// const response = await fetch(`/api/training/${userId}`, {
			// 	method: 'POST',
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 	},
			// 	body: JSON.stringify({
			// 		trainingData: trainingItems,
			// 		completedAt: new Date().toISOString()
			// 	})
			// });
			// 
			// if (!response.ok) {
			// 	throw new Error('Failed to save training data');
			// }
			
			if (onsave) {
				onsave({ userId, items: trainingItems, completionStatus });
			}
		} catch (error) {
			console.error('Failed to save training progress:', error);
			// You might want to show an error toast here
		} finally {
			isSaving = false;
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
		<div class="mx-4 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg bg-white">
			<div class="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
				<h3 class="text-lg font-semibold text-gray-900">{modalTitle}</h3>
				<p class="text-sm text-gray-600">{modalDescription}</p>
			</div>
			
			<div class="p-6">
				<div class="space-y-4">
					{#each trainingItems as item (item.id)}
						<div class="flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 {item.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} {isTrainingMode ? 'hover:border-gray-300' : ''}">
							<button
								class="mt-1 flex-shrink-0 {isTrainingMode ? 'cursor-pointer' : 'cursor-default'}"
								onclick={() => toggleTrainingItem(item.id)}
								disabled={!isTrainingMode || isSaving}
							>
								<div class="w-5 h-5 rounded border-2 flex items-center justify-center {item.completed ? 'bg-green-500 border-green-500' : isTrainingMode ? 'border-gray-300 hover:border-gray-400' : 'border-gray-300'} transition-colors">
									{#if item.completed}
										<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
										</svg>
									{/if}
								</div>
							</button>
							
							<div class="flex-1">
								<h4 class="font-medium text-gray-900 transition-all duration-200 {item.completed ? 'line-through text-gray-500' : ''}">{item.title}</h4>
								<p class="text-sm text-gray-600 transition-all duration-200 {item.completed ? 'line-through text-gray-400' : ''}">{item.description}</p>
							</div>
						</div>
					{/each}
				</div>

					{#if isTrainingMode}
						<div class="mt-6 p-4 bg-blue-50 rounded-lg">
							<div class="flex items-center justify-between">
								<div>
									<p class="font-medium text-blue-900">Fremgang</p>
									<p class="text-sm text-blue-700">{getCompletionStatus().completedCount} av {getCompletionStatus().totalCount} punkter fullført</p>
								</div>
								<div class="text-right">
									<div class="text-2xl font-bold text-blue-600">
										{Math.round((getCompletionStatus().completedCount / getCompletionStatus().totalCount) * 100)}%
									</div>
								</div>
							</div>
							<div class="mt-2 w-full bg-blue-200 rounded-full h-2">
								<div 
									class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
									style="width: {(getCompletionStatus().completedCount / getCompletionStatus().totalCount) * 100}%"
								></div>
							</div>
						</div>

						{#if getCompletionStatus().isComplete}
							<div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
								<div class="flex items-center gap-2">
									<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
									</svg>
									<p class="font-medium text-green-800">Gratulerer! All opplæring er fullført.</p>
								</div>
							</div>
						{/if}
					{:else}
						<div class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
							<div class="flex items-center gap-2">
								<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
								<p class="text-sm text-gray-700">Dette er en referanseliste over opplæringspunkter.</p>
							</div>
						</div>
					{/if}
			</div>

			<div class="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4">
				<div class="flex justify-end gap-3">
					<button
						type="button"
						onclick={handleClose}
						class="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
						disabled={isSaving}
					>
						Lukk
					</button>
					{#if isTrainingMode}
						<button
							type="button"
							onclick={handleSave}
							disabled={isSaving || !getCompletionStatus().isComplete}
							class="rounded-md px-4 py-2 text-sm text-white transition-colors disabled:opacity-50 {getCompletionStatus().isComplete ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}"
						>
							{#if isSaving}
								<span class="flex items-center gap-2">
									<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
									</svg>
									Lagrer...
								</span>
							{:else if getCompletionStatus().isComplete}
								✅ Fullfør opplæring
							{:else}
								Fullfør alle punkter først
							{/if}
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
