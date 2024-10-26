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

<div class="flex flex-col md:flex-row gap-8 w-full sm:max-w-screen-sm sm:mx-auto md:max-w-full">
	<Sidebar {types} {filterState} />

	<div class="flex-1">
		{#if filteredProducts.length > 0}
			<p class="text-sm mb-2 text-gray-800">Viser {filteredProducts.length} resultater</p>

			<ul class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
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
