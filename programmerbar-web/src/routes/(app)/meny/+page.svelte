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
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	let { data } = $props();

	let types = extractTypes(data.products);
	let breweries = extractBreweries(data.products);
	let filter = new FilterState();
	let priceRange = $derived(extractPriceRange(data.products, filter.current.showStudentPrice));
	let filteredProducts = $derived(filterProducts(data.products, filter));

	let isInitializing = $state(true);
	let isUpdatingFromUrl = $state(false);

	// Initialize filter from URL params
	function initializeFromUrl() {
		isUpdatingFromUrl = true;
		const searchParams = page.url.searchParams;

		if (searchParams.has('search')) {
			filter.current.search = searchParams.get('search') || '';
		}

		if (searchParams.has('sort')) {
			filter.current.sort = (searchParams.get('sort') || 'name-asc') as typeof filter.current.sort;
		}

		if (searchParams.has('types')) {
			filter.current.types.clear();
			const typesParam = searchParams.get('types');
			if (typesParam) {
				typesParam.split(',').forEach((type) => {
					if (type) filter.current.types.add(type);
				});
			}
		} else if (!isInitializing) {
			// Only clear if not initializing (i.e., URL changed via navigation)
			filter.current.types.clear();
		}

		if (searchParams.has('breweries')) {
			filter.current.breweries.clear();
			const breweriesParam = searchParams.get('breweries');
			if (breweriesParam) {
				breweriesParam.split(',').forEach((brewery) => {
					if (brewery) filter.current.breweries.add(brewery);
				});
			}
		} else if (!isInitializing) {
			// Only clear if not initializing (i.e., URL changed via navigation)
			filter.current.breweries.clear();
		}

		if (searchParams.has('priceMin') && searchParams.has('priceMax')) {
			const priceMin = searchParams.get('priceMin');
			const priceMax = searchParams.get('priceMax');
			if (priceMin && priceMax) {
				filter.current.priceRange = {
					min: Number.parseFloat(priceMin),
					max: Number.parseFloat(priceMax)
				};
			}
		}

		if (searchParams.has('hideSoldOut')) {
			filter.current.hideSoldOut = searchParams.get('hideSoldOut') === 'true';
		}

		if (searchParams.has('showStudentPrice')) {
			filter.current.showStudentPrice = searchParams.get('showStudentPrice') === 'true';
		}

		isUpdatingFromUrl = false;
	}

	// Update URL from filter state
	function updateUrl() {
		if (isInitializing || isUpdatingFromUrl) return;

		const searchParams = new SvelteURLSearchParams();

		if (filter.current.search) {
			searchParams.set('search', filter.current.search);
		}

		if (filter.current.sort !== 'name-asc') {
			searchParams.set('sort', filter.current.sort);
		}

		if (filter.current.types.size > 0) {
			searchParams.set('types', Array.from(filter.current.types).join(','));
		}

		if (filter.current.breweries.size > 0) {
			searchParams.set('breweries', Array.from(filter.current.breweries).join(','));
		}

		// Only include price range if it's different from the default product price range
		if (
			filter.current.priceRange &&
			(filter.current.priceRange.min !== priceRange.min ||
				filter.current.priceRange.max !== priceRange.max)
		) {
			searchParams.set('priceMin', filter.current.priceRange.min.toString());
			searchParams.set('priceMax', filter.current.priceRange.max.toString());
		}

		if (!filter.current.hideSoldOut) {
			searchParams.set('hideSoldOut', 'false');
		}

		if (!filter.current.showStudentPrice) {
			searchParams.set('showStudentPrice', 'false');
		}

		const queryString = searchParams.toString();
		const resolvedPath = resolve('/(app)/meny');
		const newUrl = resolvedPath + (queryString ? '?' + queryString : '');
		const currentUrl = resolvedPath + (page.url.search || '');
		if (newUrl !== currentUrl) {
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			goto(newUrl, { replaceState: true, noScroll: true, keepFocus: true });
		}
	}

	// Initialize price range (only if not set from URL)
	$effect(() => {
		if (isInitializing && !page.url.searchParams.has('priceMin')) {
			filter.initializePriceRange(priceRange.min, priceRange.max);
		}
	});

	// Initialize from URL on mount
	$effect(() => {
		initializeFromUrl();
		isInitializing = false;
	});

	$effect(() => {
		page.url.searchParams.toString();
		if (!isInitializing) {
			initializeFromUrl();
		}
	});

	$effect(() => {
		updateUrl();
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
			<div class="border-border mb-4 border-b pb-2 font-mono">
				<p class="text-foreground-muted mt-1 text-xs">
					Viser {filteredProducts.length} resultater
				</p>
			</div>

			<ul class="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
				{#each filteredProducts as product (product._id)}
					<li>
						<ProductPreview {product} {filter} />
					</li>
				{/each}
			</ul>
		{:else}
			<div
				class="border-border bg-card-muted flex flex-col items-center justify-center border-l-4 p-12 text-center font-mono"
			>
				<p class="text-foreground-muted mb-2">$ grep produkter.txt</p>
				<p class="text-foreground-secondary mb-4 text-sm">
					grep: produkter.txt: Finner ingen produkter som matcher søket ditt
				</p>
				<p class="text-foreground-muted mt-2 text-sm">
					Debug: Prøv å refaktorere søket ditt eller fjern noen filtre 🤓
				</p>
			</div>
		{/if}
	</div>
</div>
