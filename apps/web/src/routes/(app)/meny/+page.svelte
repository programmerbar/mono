<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { cn } from '$lib/cn';
	import Label from '$lib/components/ui/Label.svelte';
	import { urlFor } from '$lib/data/sanity/image';
	import type { ProductType } from '$lib/types';
	import { Martini } from 'lucide-svelte';
	import { getContext } from 'svelte';

	type SortOption = (typeof SORT_OPTIONS)[number]['value'];

	const QUERY_PARAM_KEYS = {
		hideSoldOut: 'sold-out',
		sort: 'sort',
		search: 'search',
		selectedProductType: 'type',
		studentPrice: 'student'
	} as const;

	const SORT_OPTIONS = [
		{ label: 'Navn A-Å', value: 'name-asc' },
		{ label: 'Navn Å-A', value: 'name-desc' },
		{ label: 'Pris lav-høy', value: 'price-asc' },
		{ label: 'Pris høy-lav', value: 'price-desc' },
		{ label: 'Alkohol lav-høy', value: 'alcohol-asc' },
		{ label: 'Alkohol høy-lav', value: 'alcohol-desc' },
		{ label: 'Volum lav-høy', value: 'volume-asc' },
		{ label: 'Volum høy-lav', value: 'volume-desc' }
	] as const;

	const { data } = $props();

	const banner = getContext<string | null>('banner');

	let hideSoldOut = $state(
		Boolean($page.url.searchParams.get(QUERY_PARAM_KEYS.hideSoldOut)) || true
	);
	let sort = $state<SortOption>(
		($page.url.searchParams.get(QUERY_PARAM_KEYS.sort) as SortOption) || 'name-asc'
	);
	let search = $state($page.url.searchParams.get(QUERY_PARAM_KEYS.search) || '');
	let selectedProductType = $state<string | null>(
		$page.url.searchParams.get(QUERY_PARAM_KEYS.selectedProductType) || null
	);
	let studentPrice = $state(
		Boolean($page.url.searchParams.get(QUERY_PARAM_KEYS.studentPrice)) || true
	);

	let productTypes = $derived(
		data.products
			.map((product) => product.productTypes)
			.flat()
			.filter(Boolean)
			.reduce((acc, productType) => {
				if (!acc.find((type) => type._id === productType!._id)) {
					acc.push(productType!);
				}

				return acc;
			}, [] as Array<ProductType>)
	);

	let filteredProducts = $derived(
		data.products
			.filter((product) => {
				if (hideSoldOut && product.isSoldOut) {
					return false;
				}

				if (!product.name.toLowerCase().includes(search.toLowerCase())) {
					return false;
				}

				if (
					selectedProductType &&
					!product.productTypes?.map((type) => type._id).includes(selectedProductType)
				) {
					return false;
				}

				return true;
			})
			.sort((a, b) => {
				const aAlcohol = a.alcoholContent ?? 0;
				const bAlcohol = b.alcoholContent ?? 0;
				const aVolume = a.volume ?? 0;
				const bVolume = b.volume ?? 0;
				const aPrice = studentPrice ? a.priceList.student : a.priceList.ordinary;
				const bPrice = studentPrice ? b.priceList.student : b.priceList.ordinary;

				if (sort === 'name-asc') {
					return a.name.localeCompare(b.name);
				}

				if (sort === 'name-desc') {
					return b.name.localeCompare(a.name);
				}

				if (sort === 'alcohol-asc') {
					return aAlcohol - bAlcohol;
				}

				if (sort === 'alcohol-desc') {
					return bAlcohol - aAlcohol;
				}

				if (sort === 'volume-asc') {
					return aVolume - bVolume;
				}

				if (sort === 'volume-desc') {
					return bVolume - aVolume;
				}

				if (sort === 'price-asc') {
					return aPrice - bPrice;
				}

				if (sort === 'price-desc') {
					return bPrice - aPrice;
				}

				return 0;
			})
	);

	$effect(() => {
		const params = new URLSearchParams();

		if (!hideSoldOut) params.set(QUERY_PARAM_KEYS.hideSoldOut, encodeURIComponent(hideSoldOut));
		if (hideSoldOut) params.delete(QUERY_PARAM_KEYS.hideSoldOut);

		if (sort !== 'name-asc') params.set(QUERY_PARAM_KEYS.sort, encodeURIComponent(sort));
		if (!sort || sort === 'name-asc') params.delete(QUERY_PARAM_KEYS.sort);

		if (search) params.set(QUERY_PARAM_KEYS.search, encodeURIComponent(search));
		if (!search) params.delete(QUERY_PARAM_KEYS.search);

		if (selectedProductType)
			params.set(QUERY_PARAM_KEYS.selectedProductType, encodeURIComponent(selectedProductType));
		if (!selectedProductType) params.delete(QUERY_PARAM_KEYS.selectedProductType);

		if (!studentPrice) params.set(QUERY_PARAM_KEYS.studentPrice, encodeURIComponent(studentPrice));
		if (studentPrice) params.delete(QUERY_PARAM_KEYS.studentPrice);

		console.log('Redirecting to: ', `${$page.url.pathname}?${params.toString()}`);

		goto(`${$page.url.pathname}?${params.toString()}`, { keepFocus: true, noScroll: true });
	});
</script>

<svelte:head>
	<title>Meny — Programmerbar</title>
</svelte:head>

<div class="flex md:flex-row flex-col py-10 gap-8">
	<div
		class={cn(
			'w-full md:sticky md:w-1/4 border-2 divide-y p-4 rounded-xl h-fit flex flex-col shadow-xl bg-background',
			banner ? 'md:top-16' : 'md:top-4'
		)}
	>
		<div class="flex flex-col gap-2 py-2">
			<Label for="search">Søk</Label>
			<div>
				<input
					class="w-full px-2 py-1 border rounded-xl"
					type="text"
					bind:value={search}
					id="search"
					placeholder="Søk etter produkt"
				/>
			</div>
		</div>
		<div class="flex flex-col gap-2 py-4">
			<Label for="sort">Sorter etter</Label>
			<select class="w-full px-2 py-1 border rounded-xl" bind:value={sort} id="sort">
				{#each SORT_OPTIONS as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>
		<div class="flex flex-col gap-2 py-4">
			<Label for="productType">Type</Label>
			<select
				class="w-full px-2 py-1 border rounded-xl"
				bind:value={selectedProductType}
				id="productType"
			>
				<option value={null}>Alle</option>
				{#each productTypes as productType}
					<option value={productType._id}>{productType.title}</option>
				{/each}
			</select>
		</div>
		<div class="flex flex-row items-center gap-4 py-4">
			<Label for="hideSoldOut">Skjul utsolgte</Label>
			<input
				class="h-4 w-4 rounded-sm checked:bg-primary checked:border-primary checked:border-2"
				type="checkbox"
				bind:checked={hideSoldOut}
				id="hideSoldOut"
			/>
		</div>
		<div class="flex flex-row items-center gap-4 py-4">
			<Label for="studentPrice">Vis studentpris</Label>
			<input
				class="h-4 w-4 rounded-sm checked:bg-primary checked:border-primary checked:border-2"
				type="checkbox"
				bind:checked={studentPrice}
				id="studentPrice"
			/>
		</div>
	</div>

	<div class="flex-1">
		{#if filteredProducts.length === 0}
			<p class="text-center text-3xl mt-16">Finner ingen produkter som matcher dine filter</p>
		{/if}
		<ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredProducts as { _id, name, image, priceList, producer, variants, isSoldOut, productTypes }}
				<li class="border-2 rounded-xl overflow-hidden bg-background shadow-xl relative">
					{#if isSoldOut}
						<div
							class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center"
						>
							<p class="text-white text-4xl rotate-45 font-medium">Utsolgt</p>
						</div>
					{/if}

					<div class="border-b-2 border-border">
						{#if image}
							<img
								src={urlFor(image).height(600).width(600).url()}
								alt={name}
								class="w-full bg-white h-48 object-contain"
							/>
						{:else}
							<div class="h-48 w-full bg-gray-200 flex items-center justify-center">
								<Martini class="text-gray-500 h-16 w-16" />
							</div>
						{/if}
					</div>

					<div class="p-4">
						<a class="hover:underline" href="/produkt/{_id}">
							<h2 class="text-2xl font-medium">
								{name}
							</h2>
						</a>
						{#if variants && variants.length > 1}
							<p class="text-sm text-gray-700">({variants.join(', ')})</p>
						{/if}
						<p class="text-lg">{studentPrice ? priceList.student : priceList.ordinary} kr</p>
						<p class="text-sm text-gray-700 font-mono font-medium">{producer}</p>
						{#if productTypes}
							<div class="flex items-center mt-2 gap-1 flex-wrap">
								{#each productTypes as productType}
									<span
										class="px-2 py-1 bg-primary bg-opacity-10 text-white text-xs font-medium rounded-xl"
										>{productType.title}</span
									>
								{/each}
							</div>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>
