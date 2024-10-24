<script lang="ts">
	import type { extractTypes } from '$lib/extract-types';
	import { FilterState, SORT_OPTIONS } from '$lib/states/filter-state.svelte';

	type Props = {
		filterState: FilterState;
		types: ReturnType<typeof extractTypes>;
	};

	let { filterState = $bindable(), types }: Props = $props();
</script>

<div
	class="flex flex-col bg-background h-fit gap-2 md:max-w-[300px] p-4 rounded-lg md:top-5 md:sticky shadow-lg border-2 w-full"
>
	<div class="flex flex-col gap-1">
		<label for="search" class="text-sm font-semibold">Søk</label>
		<input
			type="text"
			id="search"
			placeholder="Søk etter produkt"
			class="rounded-lg border-border border-2 px-2 py-1"
			bind:value={filterState.search}
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="sort" class="text-sm font-semibold">Sorter etter</label>
		<select
			id="sort"
			class="rounded-lg border-border border-2 px-2 py-1"
			bind:value={filterState.sort}
		>
			{#each SORT_OPTIONS as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>

	<div class="flex flex-col gap-1">
		<label for="type" class="text-sm font-semibold">Type</label>
		<select
			id="type"
			class="rounded-lg border-border border-2 px-2 py-1"
			bind:value={filterState.type}
		>
			<option value="">Alle</option>
			{#each types as type}
				<option value={type._id}>{type.title}</option>
			{/each}
		</select>
	</div>

	<div class="flex items-center py-2 justify-between">
		<label for="hideSoldOut" class="text-sm font-semibold">Skjul utsolgt</label>
		<input
			type="checkbox"
			id="hideSoldOut"
			class="rounded border-2 h-4 w-4"
			bind:checked={filterState.hideSoldOut}
		/>
	</div>

	<div class="flex items-center py-2 justify-between">
		<label for="showStudentPrice" class="text-sm font-semibold">Vis studentpris</label>
		<input
			type="checkbox"
			id="showStudentPrice"
			class="rounded border-2 h-4 w-4"
			bind:checked={filterState.showStudentPrice}
		/>
	</div>
</div>
