<script lang="ts">
	import { cn } from '$lib/cn';
	import type { extractTypes } from '$lib/extract-types';
	import { FilterState, SORT_OPTIONS } from '$lib/states/filter-state.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import MultipleSelect from '$lib/components/ui/MultipleSelect.svelte';
	import PriceRangeSlider from '$lib/components/ui/PriceRangeSlider.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	type Props = {
		filterState: FilterState;
		types: ReturnType<typeof extractTypes>;
		breweries: Array<string>;
		priceRange: { min: number; max: number };
		alwaysFilteredByCredits?: boolean;
		disableSticky?: boolean;
	};

	let {
		filterState = $bindable(),
		types,
		breweries,
		priceRange,
		alwaysFilteredByCredits = false,
		disableSticky = false
	}: Props = $props();

	function toggleBrewery(brewery: string) {
		const newBreweries = new SvelteSet<string>(filterState.breweries);
		if (newBreweries.has(brewery)) {
			newBreweries.delete(brewery);
		} else {
			newBreweries.add(brewery);
		}
		filterState.breweries = newBreweries;
	}

	function toggleType(typeId: string) {
		const newTypes = new SvelteSet<string>(filterState.types);
		if (newTypes.has(typeId)) {
			newTypes.delete(typeId);
		} else {
			newTypes.add(typeId);
		}
		filterState.types = newTypes;
	}

	function updatePriceRange(newRange: { min: number; max: number }) {
		filterState.priceRange = newRange;
	}

	// Create a map of type IDs to titles for the MultipleSelect component
	const typeOptions = types.map((type) => ({ id: type._id, label: type.title }));
</script>

<div
	class={cn(
		'bg-background flex h-fit w-full flex-col gap-2 rounded-lg border-2 p-4 shadow-lg md:max-w-[300px]',
		{
			'md:sticky md:top-5': !disableSticky
		}
	)}
>
	<div class="flex flex-col gap-1">
		<label for="search" class="text-sm font-semibold">Søk</label>
		<input
			type="text"
			id="search"
			placeholder="Søk etter produkt"
			class="border-border rounded-lg border-2 px-2 py-1"
			bind:value={filterState.search}
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="sort" class="text-sm font-semibold">Sorter etter</label>
		<select
			id="sort"
			class="border-border rounded-lg border-2 px-2 py-1"
			bind:value={filterState.sort}
		>
			{#each SORT_OPTIONS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>

	<MultipleSelect
		options={typeOptions}
		selected={filterState.types}
		onToggle={toggleType}
		placeholder="Alle typer"
		label="Type"
	/>

	<MultipleSelect
		options={breweries.map((brewery) =>
			brewery === '__no_brewery__'
				? { id: '__no_brewery__', label: 'Uten bryggeri' }
				: { id: brewery, label: brewery }
		)}
		selected={filterState.breweries}
		onToggle={toggleBrewery}
		placeholder="Alle bryggerier"
		label="Bryggeri"
	/>

	<PriceRangeSlider
		min={priceRange.min}
		max={priceRange.max}
		value={filterState.priceRange}
		onUpdate={updatePriceRange}
	/>

	{#if alwaysFilteredByCredits}{:else}
		<div class="flex items-center justify-between py-2">
			<label for="hideSoldOut" class="text-sm font-semibold">Skjul utsolgt</label>
			<input
				type="checkbox"
				id="hideSoldOut"
				class="h-4 w-4 rounded border-2"
				bind:checked={filterState.hideSoldOut}
			/>
		</div>

		<div class="flex items-center justify-between py-2">
			<label for="showStudentPrice" class="text-sm font-semibold">Vis studentpris</label>
			<input
				type="checkbox"
				id="showStudentPrice"
				class="h-4 w-4 rounded border-2"
				bind:checked={filterState.showStudentPrice}
			/>
		</div>
	{/if}

	<div class="pt-2">
		<Button intent="outline" class="w-full" onclick={() => filterState.reset()}>
			Tilbakestill filtre
		</Button>
	</div>
</div>
