<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import ProductPreview from '$lib/components/app/meny/ProductPreview.svelte';
	import ProductSidebar from '$lib/components/app/meny/ProductSidebar.svelte';
	import ClaimModal from '$lib/components/portal/ClaimModal.svelte';
	import ClaimedCredit from '$lib/components/portal/ClaimedCredits.svelte';
	import { extractTypes } from '$lib/extract-types';
	import { filterProducts } from '$lib/filter-products';
	import { FilterState } from '$lib/states/filter-state.svelte';
	import ProductDisplay from '$lib/components/app/meny/ProductDisplay.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { normalDate } from '$lib/date';
	import { extractBreweries } from '$lib/extract-breweries.js';
	import { extractPriceRange } from '$lib/extract-price-range.js';

	let { data } = $props();

	let filterState = new FilterState();
	let loading = $state(false);
	let types = extractTypes(data.products);
	let breweries = extractBreweries(data.products);
	let priceRange = $derived(extractPriceRange(data.products, filterState.showStudentPrice));
	let selectedProduct = $state<null | Product>(null);
	let claimedProduct = $state<null | Product>(null);
	let timerSeconds = $state(30);
	let timerInterval = $state<ReturnType<typeof setInterval> | null>(null);

	let userRole = $derived(data.user?.role);

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

	function handleClaimSubmit() {
		loading = true;
		return async ({ result, update }: { result: any; update: any }) => {
			await update();
			loading = false;

			if (result.type === 'success' && result.data) {
				toast.success(`${selectedProduct?.name} claimed!`);
				if (typeof result.data.updatedBeerCount === 'number') {
					data.unclaimedBeers = result.data.updatedBeerCount;
				} else if (selectedProduct && selectedProduct.priceList.credits) {
					data.unclaimedBeers -= selectedProduct.priceList.credits;
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
	}
</script>

<svelte:head>
	<title>Cash Out</title>
</svelte:head>

<ClaimModal {claimedProduct} {timerSeconds} onClose={closeClaimPopup} />

{#if selectedProduct}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
		<div class="w-[400px] rounded-lg bg-white p-6 shadow-lg">
			<h2 class="mb-4 text-center text-2xl font-bold">Claim produkt</h2>

			<ProductDisplay product={selectedProduct} />

			{#if selectedProduct?.priceList.credits && data.unclaimedBeers >= selectedProduct.priceList.credits}
				<form method="post" action="?/claimProduct" use:enhance={handleClaimSubmit}>
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
					Du har ikkje nokk bonger. Du trenger {selectedProduct.priceList.credits}, og du har: {data.unclaimedBeers}.
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

{#if data.lastClaimed}
	<p class="mt-8 text-center text-lg text-gray-600">
		Historikk: {data.lastClaimed.productName} - {normalDate(data.lastClaimed.claimedAt)}
	</p>
{/if}
