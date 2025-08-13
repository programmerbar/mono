<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	interface TrainingItem {
		id: number;
		title: string;
		description: string;
		completed: boolean;
		category: string;
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
		{ id: 1, title: 'Bytte keg på en riktig måte', description: 'Lært at kegs burde bli oppbevart kjølig og stående kaldt for å holde seg', completed: false, category: 'Bruk av bar' },
		{ id: 2, title: 'Tappe pils på en riktig måte', description: 'Riktig tapping av øl', completed: false, category: 'Bruk av bar' },
		{ id: 3, title: 'Glassvasken', description: 'Skru på/av glassvasken, tømme og skylle glass før maskinen', completed: false, category: 'Bruk av bar' },
		{ id: 4, title: 'Isbiter og isbitmaskin', description: 'Bruke dedikert isbit "skje", sjekke at maskinen er på og lager isbiter', completed: false, category: 'Bruk av bar' },
		{ id: 5, title: 'Kassesystem', description: 'Åpne kassen, ta imot betaling (vanlig pris og internpris), slette/redigere priser, stenge kassen', completed: false, category: 'Bruk av bar' },
		{ id: 6, title: 'Påfyll av varer', description: 'Fylle på varer kontinuerlig, spesielt mot slutten av vakten', completed: false, category: 'Bruk av bar' },
		{ id: 7, title: 'Temperatursjekk', description: 'Sjekke temperatur på kjøleskap (skal bli skrevet ned)', completed: false, category: 'Bruk av bar' },
		
		{ id: 8, title: 'Ikke oversjenke', description: 'Aldri oversjenke da dette er ulovlig', completed: false, category: 'Lover og sikkerhet' },
		{ id: 9, title: 'Autoritet til å si nei', description: 'Har autoritet til å si nei til å servere alkohol', completed: false, category: 'Lover og sikkerhet' },
		{ id: 10, title: 'Skjenkeløyve og dokumenter', description: 'Hvor skjenkeløyve og opplæringsskjema er i baren, i tilfelle kontroll', completed: false, category: 'Lover og sikkerhet' },
		{ id: 11, title: 'Nødsituasjoner', description: 'Vite hva å gjøre i nødsituasjon, for eksempel brann', completed: false, category: 'Lover og sikkerhet' },
		{ id: 12, title: 'Fast skjenkeløyve', description: 'Baren har fast skjenkeløyve som vi kan miste hvis vi får for mange prikker', completed: false, category: 'Lover og sikkerhet' },
		{ id: 13, title: 'Alkoholreklame', description: 'Ikke lov til å reklamere for alkohol, ikke foreslå alkohol men spørre "Hva vil du ha?"', completed: false, category: 'Lover og sikkerhet' },
		
		{ id: 14, title: 'Renhold i baren', description: 'Viktigheten av å holde det rent i baren og på lageret (før, under og etter servering)', completed: false, category: 'Vask og hygiene' },
		{ id: 15, title: 'Personlig hygiene', description: 'Viktigheten av å ha god personlig hygiene', completed: false, category: 'Vask og hygiene' },
		{ id: 16, title: 'Håndvask', description: 'Hvordan vaske hendene ordentlig', completed: false, category: 'Vask og hygiene' },
		{ id: 17, title: 'Rengjøring av arbeidsflater', description: 'Hvordan tørke over benk og vask av gulv', completed: false, category: 'Vask og hygiene' },
		{ id: 18, title: 'Søppelhåndtering', description: 'Hva å gjøre med papp og annet søppel, og koden til søppelstasjonen', completed: false, category: 'Vask og hygiene' },
		{ id: 19, title: 'Vask etter kegbytte', description: 'Bytter man keg, så vasker man hendene', completed: false, category: 'Vask og hygiene' },
		{ id: 20, title: 'Rengjøring av barutstyr', description: 'Vask og rengjør barutstyr, f.eks. tappetårn, målebeger, shaker, isøse, barskje osv.', completed: false, category: 'Vask og hygiene' }
	];

	let trainingItems = $state([...defaultTrainingItems]);
	let isSaving = $state(false);
	let isLoading = $state(false);

	let isTrainingMode = $derived(userId !== null && userId !== undefined);
	let modalTitle = $derived(isTrainingMode ? `Opplæring for ${userName}` : 'Opplæringsliste');
	let modalDescription = $derived(isTrainingMode 
		? 'Marker av hvert punkt etter som opplæringen blir fullført'
		: 'Oversikt over alle opplæringspunkter som må gjennomgås');

	let groupedTrainingItems = $derived.by(() => {
		const grouped = trainingItems.reduce((acc, item) => {
			if (!acc[item.category]) {
				acc[item.category] = [];
			}
			acc[item.category].push(item);
			return acc;
		}, {} as Record<string, TrainingItem[]>);
		return grouped;
	});

	$effect(() => {
		if (isTrainingMode && isOpen) {
			isLoading = true;
			(async () => {
				try {
					const response = await fetch(`/api/training/${userId}`);
					if (response.ok) {
						const userData = await response.json() as { trainingData?: TrainingItem[] };
						trainingItems = userData.trainingData || [...defaultTrainingItems];
					} else {
						trainingItems = [...defaultTrainingItems];
					}
				} catch (error) {
					console.error('Failed to load training data:', error);
					trainingItems = [...defaultTrainingItems];
				} finally {
					isLoading = false;
				}
			})();
		} else if (!isTrainingMode) {
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

	function handleSave() {
		if (!isTrainingMode) return;
		
		const completionStatus = getCompletionStatus();
		if (!completionStatus.isComplete) {
			return;
		}
		
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
		<div class="mx-4 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg bg-white">
			<div class="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
				<h3 class="text-lg font-semibold text-gray-900">{modalTitle}</h3>
				<p class="text-sm text-gray-600">{modalDescription}</p>
			</div>
			
			<div class="p-6">
				<div class="space-y-6">
					{#each Object.entries(groupedTrainingItems) as [category, items] (category)}
						<div class="space-y-3">
							<h3 class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">{category}</h3>
							<div class="space-y-3">
								{#each items as item (item.id)}
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
								await invalidateAll(); // Refresh page data
								if (onsave && userId !== null) {
									const completionStatus = getCompletionStatus();
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
