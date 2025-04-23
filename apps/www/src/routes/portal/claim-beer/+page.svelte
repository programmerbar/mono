<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import ProductPreview from '$lib/components/app/meny/ProductPreview.svelte';
	import Sidebar from '$lib/components/app/meny/Sidebar.svelte';
	import ClaimModal from '$lib/components/cards/ClaimModal.svelte';
	import { extractTypes } from '$lib/extract-types';
	import { filterProducts } from '$lib/filter-products';
	import { FilterState } from '$lib/states/filter-state.svelte';

	let loading = $state(false);
	let selectedProduct = $state<null | Product>(null);
	let claimedProduct = $state<null | Product>(null);
	let timerSeconds = $state(30);
	let timerInterval = $state<ReturnType<typeof setInterval> | null>(null);
	let { data } = $props();
	let { unclaimedBeers } = $derived(data);
	let types = extractTypes(data.products);
	let filterState = new FilterState();

	$effect(() => {
		filterState.showCreditPrice = true;
		filterState.showStudentPrice = false;
	});

	type Product = ReturnType<typeof filterProducts>[number];

	let standardFiltered = $derived(filterProducts(data.products, filterState));
	let filteredProducts = $derived(
		standardFiltered.filter((product) => product.priceList.Credits && product.priceList.Credits > 0)
	);

	function handleProductSelect(product: Product) {
		selectedProduct = product;
	}

	function canClaimProduct(product: Product | null) {
		if (!product || !product.priceList.Credits) return false;
		return unclaimedBeers >= product.priceList.Credits;
	}

	function handleKeyDown(event: KeyboardEvent, product: Product) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleProductSelect(product);
		}
	}

	function startClaimTimer(product: Product) {
		claimedProduct = product;
		timerSeconds = 30;

		if (timerInterval !== null) {
			clearInterval(timerInterval);
		}

		timerInterval = setInterval(() => {
			timerSeconds -= 1;
			if (timerSeconds <= 0) {
				if (timerInterval !== null) {
					clearInterval(timerInterval);
					timerInterval = null;
				}

				setTimeout(() => {
					claimedProduct = null;
				}, 2000);
			}
		}, 1000);
	}

	function closeClaimPopup() {
		if (timerInterval !== null) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
		claimedProduct = null;
	}
</script>

<svelte:head>
	<title>Cash Out</title>
</svelte:head>

<ClaimModal {claimedProduct} {timerSeconds} onClose={closeClaimPopup} />

<div class="flex w-full flex-col gap-8 sm:mx-auto sm:max-w-screen-sm md:max-w-full md:flex-row">
	<Sidebar {types} {filterState} alwaysFilteredByCredits={true} />
	<div class="flex-1">
		{#if filteredProducts.length > 0}
			<p class="mb-2 text-sm text-gray-800">Viser {filteredProducts.length} resultater</p>
			<ul class="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
				{#each filteredProducts as product}
					<li>
						<button
							class="w-full h-full text-left block"
							onclick={() => handleProductSelect(product)}
							onkeydown={(e) => handleKeyDown(e, product)}
						>
							<ProductPreview
								{product}
								{filterState}
								alwaysShowCreditPrice={true}
								disableLink={true}
							/>
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="text-lg text-gray-800">Ingen produkter funnet</p>
		{/if}
	</div>
</div>

<section class="mt-8">
	{#if unclaimedBeers === 1}
		<p class="mb-6 text-center text-6xl font-bold">{unclaimedBeers} bong igjen</p>
	{:else if unclaimedBeers > 1}
		<p class="mb-6 text-center text-6xl font-bold">{unclaimedBeers} bonger igjen</p>
	{/if}

	{#if selectedProduct}
		<div class="mx-auto max-w-md rounded-lg border p-4 shadow-md">
			<h3 class="mb-2 text-xl font-bold">{selectedProduct.name}</h3>
			<p class="mb-4">
				Pris: <span class="font-semibold">{selectedProduct.priceList.Credits} bonger</span>
			</p>

			{#if canClaimProduct(selectedProduct)}
				<form
					class="mx-auto w-fit"
					method="post"
					action="?/claimProduct"
					use:enhance={() => {
						loading = true;
						return async ({ result, update }) => {
							await update();
							loading = false;

							if (result.type === 'success' && result.data) {
								toast.success(`${selectedProduct?.name} claimed!`);
								if (typeof result.data.updatedBeerCount === 'number') {
									unclaimedBeers = result.data.updatedBeerCount;
								} else if (selectedProduct && selectedProduct.priceList.Credits) {
									unclaimedBeers -= selectedProduct.priceList.Credits;
								}
								if (selectedProduct) {
									startClaimTimer(selectedProduct);
								}

								selectedProduct = null;
							} else {
								const errorMessage =
									result.type === 'failure' && result.data?.message
										? String(result.data?.message)
										: 'Det oppstod ein feil';

								toast.error(errorMessage);
							}
						};
					}}
				>
					<input type="hidden" name="productId" value={selectedProduct._id} />
					<input type="hidden" name="creditCost" value={selectedProduct.priceList.Credits} />
					<button
						type="submit"
						disabled={loading}
						class="mx-auto w-full rounded-md bg-blue-500 px-5 py-2 text-center text-lg font-medium text-white transition-colors hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:opacity-50"
					>
						{#if selectedProduct?.priceList.Credits === 1}
							Claim {selectedProduct.name} ({selectedProduct.priceList.Credits} bong)
						{:else}
							Claim {selectedProduct.name} ({selectedProduct.priceList.Credits} bonger)
						{/if}
					</button>
				</form>
			{:else}
				<p class="text-center text-red-500">
					Du har ikke nok bonger til dette produktet. Du trenger {selectedProduct.priceList.Credits}
					bonger, men har bare {unclaimedBeers}.
				</p>
			{/if}

			<button
				class="mt-4 w-full rounded-md border border-gray-300 px-5 py-2 text-center text-lg font-medium transition-colors hover:bg-gray-100"
				onclick={() => (selectedProduct = null)}
			>
				Avbryt
			</button>
		</div>
	{:else if unclaimedBeers > 0 && !claimedProduct}
		<p class="text-center text-lg">Velg et produkt med bongene dine</p>
	{:else if !claimedProduct}
		<p class="mb-6 text-center text-lg">Du har ingen bonger igjen</p>
	{/if}
</section>
