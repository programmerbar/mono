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

	function formatDate(date: Date) {
		return new Date(date).toLocaleString('no-NO', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
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
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div class="w-[400px] rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-center text-2xl font-bold">Claim Product</h2>

				<div class="mb-6 flex items-center justify-center">
					{#if selectedProduct.image}
						<img
							src={urlFor(selectedProduct.image).width(200).height(200).url()}
							alt={selectedProduct.name}
							class="h-40 w-40 object-contain"
						/>
					{:else}
						<div class="flex h-40 w-40 items-center justify-center rounded-lg bg-gray-100">
							<span class="text-gray-400">No image</span>
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
							<button
								type="submit"
								disabled={loading}
								class="flex-1 rounded-md bg-blue-500 px-5 py-2 text-center text-lg font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
							>
								{loading ? 'Processing...' : 'Claim'}
							</button>
							<button
								type="button"
								class="flex-1 rounded-md border border-gray-300 px-5 py-2 text-center text-lg font-medium transition-colors hover:bg-gray-100"
								onclick={() => (selectedProduct = null)}
							>
								Cancel
							</button>
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
						Close
					</button>
				{/if}
			</div>
		</div>
	{/if}

	<div class="flex w-full flex-col gap-8 sm:mx-auto sm:max-w-screen-sm md:max-w-full md:flex-row">
		<div>
			<div class="mb-4 items-center justify-center rounded-xl border-2 bg-white p-4 shadow-md">
				<div class="text-2xl font-bold text-gray-900">
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
					{#each filteredProducts as product}
						<li>
							<button
								class="block h-full w-full text-left"
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

	{#if data.lastClaimed}
		<p class="mt-8 text-center text-lg text-gray-600">
			Historikk: {data.lastClaimed.productName} - {formatDate(data.lastClaimed.claimedAt)}
		</p>
	{/if}
{/if}
