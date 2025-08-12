<script lang="ts">
	import { cn } from '$lib/cn';
	import type { extractTypes } from '$lib/extract-types';
	import { FilterState, SORT_OPTIONS } from '$lib/states/filter-state.svelte';

	type Props = {
		filterState: FilterState;
		types: ReturnType<typeof extractTypes>;
		alwaysFilteredByCredits?: boolean;
		disableSticky?: boolean;
	};

	let {
		filterState = $bindable(),
		types,
		alwaysFilteredByCredits = false,
		disableSticky = false
	}: Props = $props();
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

	<div class="flex flex-col gap-1">
		<label for="type" class="text-sm font-semibold">Type</label>
		<select
			id="type"
			class="border-border rounded-lg border-2 px-2 py-1"
			bind:value={filterState.type}
		>
			<option value="">Alle</option>
			{#each types as type (type._id)}
				<option value={type._id}>{type.title}</option>
			{/each}
		</select>
	</div>

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
</div>
