<script lang="ts">
	import ProductPreview from '$lib/components/app/meny/ProductPreview.svelte';
	import Sidebar from '$lib/components/app/meny/Sidebar.svelte';
	import { extractTypes } from '$lib/extract-types';
	import { extractBreweries } from '$lib/extract-breweries';
	import { filterProducts } from '$lib/filter-products';
	import { FilterState } from '$lib/states/filter-state.svelte';

	let { data } = $props();

	let types = extractTypes(data.products);
	let breweries = extractBreweries(data.products);
	let filterState = new FilterState();
	let filteredProducts = $derived(filterProducts(data.products, filterState));
</script>

<svelte:head>
	<title>Meny</title>
</svelte:head>

<div class="flex w-full flex-col gap-8 sm:mx-auto sm:max-w-screen-sm md:max-w-full md:flex-row">
	<Sidebar {types} {breweries} {filterState} />

	<div class="flex-1">
		{#if filteredProducts.length > 0}
			<p class="mb-2 text-sm text-gray-800">Viser {filteredProducts.length} resultater</p>

			<ul class="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
				{#each filteredProducts as product (product._id)}
					<li>
						<ProductPreview {product} {filterState} />
					</li>
				{/each}
			</ul>
		{:else}
			<div
				class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center"
			>
				<div class="mb-4 text-6xl">🐛</div>
				<h3 class="mb-2 font-mono text-xl font-semibold text-gray-900">
					404: Produkter ikke funnet
				</h3>
				<p class="mt-2 text-sm text-gray-500">
					Debug: Prøv å refaktorere søket ditt eller fjern noen filtre 🤓
				</p>
			</div>
		{/if}
	</div>
</div>
