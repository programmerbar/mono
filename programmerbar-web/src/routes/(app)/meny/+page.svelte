<script lang="ts">
	import ProductPreview from '$lib/components/app/meny/ProductPreview.svelte';
	import ProductSidebar from '$lib/components/app/meny/ProductSidebar.svelte';
	import {
		filterProducts,
		extractBreweries,
		extractPriceRange,
		extractTypes
	} from '$lib/utils/products';
	import { FilterState } from '$lib/states/filter-state.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data } = $props();

	let types = extractTypes(data.products);
	let breweries = extractBreweries(data.products);
	let filter = new FilterState();
	let priceRange = $derived(extractPriceRange(data.products, filter.current.showStudentPrice));
	let filteredProducts = $derived(filterProducts(data.products, filter));

	$effect(() => {
		filter.initializePriceRange(priceRange.min, priceRange.max);
	});
</script>

<SEO
	title="Meny"
	description="Utforsk vår meny med øl, snacks, cider og andre drikker. Studentpriser tilgjengelig for alle produkter."
	keywords="meny, øl, cider, drikker, studentpriser, programmerbar, priser"
	canonical="/meny"
	type="website"
/>

<div class="flex w-full flex-col gap-8 sm:mx-auto sm:max-w-screen-sm md:max-w-full md:flex-row">
	<ProductSidebar {types} {breweries} {priceRange} {filter} />

	<div class="flex-1">
		{#if filteredProducts.length > 0}
			<p class="mb-2 text-sm text-gray-800">Viser {filteredProducts.length} resultater</p>

			<ul class="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
				{#each filteredProducts as product (product._id)}
					<li>
						<ProductPreview {product} {filter} />
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
