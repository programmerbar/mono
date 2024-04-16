<script lang="ts">
	import Label from '$lib/components/ui/Label.svelte';
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

	let filteredProducts = $derived(
		data.products
			.filter((product) => {
				if (hideSoldOut && product.isSoldOut) {
					return false;
				}

				if (!product.name.toLowerCase().includes(search.toLowerCase())) {
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

				if (sort === 'price-asc') {
					return a.price - b.price;
				}

				if (sort === 'price-desc') {
					return b.price - a.price;
				}

				return 0;
			})
	);
</script>

<svelte:head>
	<title>Meny — Programmerbar</title>
</svelte:head>

<div
	class="border-2 border-black p-4 rounded-xl flex flex-col md:flex-row gap-8 md:gap-0 items-center md:divide-x shadow-xl bg-background"
>
	<div class="flex flex-row items-center px-4">
		<input class="h-4 w-4 mr-2" type="checkbox" bind:checked={hideSoldOut} id="hideSoldOut" />
		<Label for="hideSoldOut">Skjul utsolgte</Label>
	</div>
	<div class="flex flex-row items-center px-4">
		<Label class="mr-2" for="sort">Sorter etter</Label>
		<select class="w-fit px-2 py-1 border rounded-xl" bind:value={sort} id="sort">
			{#each SORT_OPTIONS as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>
	<div class="flex flex-row items-center gap-4 px-4">
		<Label for="search">Søk</Label>
		<input
			class="w-full px-2 py-1 border rounded-xl"
			type="text"
			bind:value={search}
			id="search"
			placeholder="Søk etter produkt"
		/>
	</div>
</div>

{#if filteredProducts.length === 0}
	<p class="text-center text-3xl mt-16">Finner ingen produkter som matcher dine filter</p>
{/if}
<ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-10">
	{#each filteredProducts as { name, image, price, producer, variants, isSoldOut }}
		<li class="border-2 border-black rounded-xl overflow-hidden bg-background shadow-xl relative">
			{#if isSoldOut}
				<div
					class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center"
				>
					<p class="text-white text-4xl rotate-45 font-medium">Utsolgt</p>
				</div>
			{/if}

			<div class="border-b-2 border-b-black">
				{#if image}
					<img src={image} alt={name} class="w-full bg-white h-48 object-contain" />
				{:else}
					<div class="h-48 w-full bg-gray-200 flex items-center justify-center">
						<Martini class="text-gray-500 h-16 w-16" />
					</div>
				{/if}
			</div>

			<div class="p-4">
				<h2 class="text-2xl font-medium">
					{name}
				</h2>
				{#if variants && variants.length > 1}
					<p class="text-sm text-gray-700">({variants.join(', ')})</p>
				{/if}
				<p class="text-lg">{price} kr</p>
				<p class="text-sm text-gray-700 font-mono font-medium">{producer}</p>
			</div>
		</li>
	{/each}
</ul>
