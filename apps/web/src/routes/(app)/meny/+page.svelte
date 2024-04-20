<script lang="ts">
	import Label from '$lib/components/ui/Label.svelte';
	import { urlFor } from '$lib/data/sanity/image.js';
	import type { ProductType } from '$lib/types';
	import { Martini } from 'lucide-svelte';

	const { data } = $props();

	const SORT_OPTIONS = [
		{ label: 'Navn A-Å', value: 'name-asc' },
		{ label: 'Navn Å-A', value: 'name-desc' },
		{ label: 'Pris lav-høy', value: 'price-asc' },
		{ label: 'Pris høy-lav', value: 'price-desc' }
	] as const;

	type SortOption = (typeof SORT_OPTIONS)[number]['value'];

	let hideSoldOut = $state(true);
	let sort = $state<SortOption>('name-asc');
	let search = $state('');
	let selectedProductType = $state<string | null>(null);
	let studentPrice = $state(true);

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
				if (sort === 'name-asc') {
					return a.name.localeCompare(b.name);
				}

				if (sort === 'name-desc') {
					return b.name.localeCompare(a.name);
				}

				const aPrice = studentPrice ? a.priceList.student : a.priceList.ordinary;
				const bPrice = studentPrice ? b.priceList.student : b.priceList.ordinary;

				if (sort === 'price-asc') {
					return aPrice - bPrice;
				}

				if (sort === 'price-desc') {
					return bPrice - aPrice;
				}

				return 0;
			})
	);
</script>

<svelte:head>
	<title>Meny — Programmerbar</title>
</svelte:head>

<div class="flex md:flex-row flex-col py-10 gap-8">
	<div
		class="w-full md:sticky md:top-4 md:w-1/4 border-2 border-black divide-y p-4 rounded-xl h-fit flex flex-col shadow-xl bg-background"
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
				<li
					class="border-2 border-black rounded-xl overflow-hidden bg-background shadow-xl relative"
				>
					{#if isSoldOut}
						<div
							class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center"
						>
							<p class="text-white text-4xl rotate-45 font-medium">Utsolgt</p>
						</div>
					{/if}

					<div class="border-b-2 border-b-black">
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
