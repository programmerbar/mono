<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import ProductPreview from '$lib/components/app/meny/ProductPreview.svelte';
	import Sidebar from '$lib/components/app/meny/Sidebar.svelte';
	import ClaimModal from '$lib/components/cards/ClaimModal.svelte';
	import ClaimedCredit from '$lib/components/downloads/ClaimedCredits.svelte';
	import { extractTypes } from '$lib/extract-types';
	import { filterProducts } from '$lib/filter-products';
	import { FilterState } from '$lib/states/filter-state.svelte';
	import { urlFor } from '$lib/api/sanity/image';
	import Button from '$lib/components/ui/Button.svelte';
	import { normalDate } from '$lib/date';

	let loading = $state(false);
	let selectedProduct = $state<null | Product>(null);
	let claimedProduct = $state<null | Product>(null);
	let timerSeconds = $state(30);
	let timerInterval = $state<ReturnType<typeof setInterval> | null>(null);
	let { data } = $props();
	let { unclaimedBeers } = $derived(data);
	let types = extractTypes(data.products);
	let filterState = new FilterState();

	let userRole = $derived(data.user?.role);
	let isLoading = $state(true);

	$effect(() => {
		if (data && data.products) {
			isLoading = false;
		}
	});

	$effect(() => {
		filterState.showCreditPrice = true;
		filterState.showStudentPrice = false;
	});

	type Product = ReturnType<typeof filterProducts>[number];

	let standardFiltered = $derived(filterProducts(data.products, filterState));
	let filteredProducts = $derived(
		standardFiltered.filter((product) => product.priceList.credits && product.priceList.credits > 0)
	);

	function handleProductSelect(product: Product) {
		selectedProduct = product;
	}

	function canClaimProduct(product: Product | null) {
		if (!product || !product.priceList.credits) return false;
		return unclaimedBeers >= product.priceList.credits;
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

{#if isLoading}
	<div class="flex min-h-screen items-center justify-center">
		<p>Loading...</p>
	</div>
{:else}
	<ClaimModal {claimedProduct} {timerSeconds} onClose={closeClaimPopup} />

	{#if selectedProduct}
		<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
			<div class="w-[400px] rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-center text-2xl font-bold">Claim produkt</h2>

				<div class="mb-6 flex items-center justify-center">
					{#if selectedProduct.image}
						<img
							src={urlFor(selectedProduct.image).width(200).height(200).url()}
							alt={selectedProduct.name}
							class="h-40 w-40 object-contain"
						/>
					{:else}
						<div class="flex h-40 w-40 items-center justify-center rounded-lg bg-gray-100">
							<span class="text-gray-400">Ingen bilde</span>
						</div>
					{/if}
				</div>

				<div class="mb-6 text-center">
					<p class="text-xl font-semibold">{selectedProduct.name}</p>
					<p class="text-gray-600">
						Pris: {selectedProduct.priceList.credits}
						{selectedProduct.priceList.credits === 1 ? 'bong' : 'bonger'}
					</p>
				</div>

				{#if canClaimProduct(selectedProduct)}
					<form
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
									} else if (selectedProduct && selectedProduct.priceList.credits) {
										unclaimedBeers -= selectedProduct.priceList.credits;
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
						<input type="hidden" name="productName" value={selectedProduct.name} />
						<input
							type="hidden"
							name="productType"
							value={selectedProduct.productTypes?.[0]?.title || ''}
						/>
						<input type="hidden" name="creditCost" value={selectedProduct.priceList.credits} />

						<div class="flex gap-4">
							<Button type="submit" class="w-full" disabled={loading}>
								{loading ? 'Laster...' : 'Claim'}
							</Button>
							<Button
								type="button"
								class="w-full"
								intent="danger"
								onclick={() => (selectedProduct = null)}>Avbryt</Button
							>
						</div>
					</form>
				{:else}
					<p class="mb-4 text-center text-red-500">
						Du har ikkje nokk bonger. Du trenger {selectedProduct.priceList.credits}, og du har: {unclaimedBeers}.
					</p>
					<button
						class="w-full rounded-md border border-gray-300 px-5 py-2 text-center text-lg font-medium transition-colors hover:bg-gray-100"
						onclick={() => (selectedProduct = null)}
					>
						Lukk
					</button>
				{/if}
			</div>
		</div>
	{/if}

	<div class="flex w-full flex-col gap-8 sm:mx-auto sm:max-w-screen-sm md:max-w-full md:flex-row">
		<div>
			<div class="bg-background mb-4 items-center justify-center rounded-xl border-2 p-4 shadow-md">
				<div class="bg-backg text-2xl font-bold text-gray-900">
					{unclaimedBeers}
					{unclaimedBeers === 1 ? 'bong' : 'bonger'}
				</div>
			</div>

			<Sidebar {types} {filterState} alwaysFilteredByCredits={true} />

			{#if userRole === 'board'}
				<ClaimedCredit />
			{/if}
		</div>

		<div class="flex-1">
			{#if filteredProducts && filteredProducts.length > 0}
				<p class="mb-2 text-sm text-gray-800">Viser {filteredProducts.length} resultater</p>
				<ul class="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
					{#each filteredProducts as product (product._id)}
						<li>
							<button
								class="block h-full w-full text-left"
								onclick={() => handleProductSelect(product)}
								onkeydown={(e) => handleKeyDown(e, product)}
							>
								<ProductPreview
									{product}
									{filterState}
									alwaysShowCreditPrice
									disableLink
									disableWishlist
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

	{#if data.lastClaimed}
		<p class="mt-8 text-center text-lg text-gray-600">
			Historikk: {data.lastClaimed.productName} - {normalDate(data.lastClaimed.claimedAt)}
		</p>
	{/if}
{/if}
