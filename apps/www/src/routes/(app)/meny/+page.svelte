<script lang="ts">
	import ProductPreview from '$lib/components/app/meny/ProductPreview.svelte';
	import Sidebar from '$lib/components/app/meny/Sidebar.svelte';
	import { extractTypes } from '$lib/extract-types';
	import { filterProducts } from '$lib/filter-products';
	import { FilterState } from '$lib/states/filter-state.svelte';

	let { data } = $props();

	let types = extractTypes(data.products);
	let filterState = new FilterState();
	let filteredProducts = $derived(filterProducts(data.products, filterState));
</script>

<svelte:head>
	<title>Meny</title>
</svelte:head>

<div class="flex w-full flex-col gap-8 sm:mx-auto sm:max-w-screen-sm md:max-w-full md:flex-row">
	<Sidebar {types} {filterState} />

	<div class="flex-1">
		{#if filteredProducts.length > 0}
			<p class="mb-2 text-sm text-gray-800">Viser {filteredProducts.length} resultater</p>

			<ul class="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
				{#each filteredProducts as product}
					<li>
						<ProductPreview {product} {filterState} />
					</li>
				{/each}
			</ul>
		{:else}
			<p class="text-lg text-gray-800">Ingen produkter funnet</p>
		{/if}
	</div>
</div>
