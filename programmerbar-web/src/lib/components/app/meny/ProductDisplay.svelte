<script lang="ts">
	import { urlFor } from '$lib/api/sanity/image';
	import type { filterProducts } from '$lib/filter-products';
	
	type Product = ReturnType<typeof filterProducts>[number];
	type Props = {
		product: Product;
		showCredits?: boolean;
	};
	
	let { product, showCredits = true }: Props = $props();
</script>

<div class="mb-6 flex items-center justify-center">
	{#if product.image}
		<img
			src={urlFor(product.image).width(200).height(200).url()}
			alt={product.name}
			class="h-40 w-40 object-contain"
		/>
	{:else}
		<div class="flex h-40 w-40 items-center justify-center rounded-lg bg-gray-100">
			<span class="text-gray-400">Ingen bilde</span>
		</div>
	{/if}
</div>

<div class="mb-6 text-center">
	<p class="text-xl font-semibold">{product.name}</p>
	{#if showCredits && product.priceList.credits}
		<p class="text-gray-600">
			Pris: {product.priceList.credits}
			{product.priceList.credits === 1 ? 'bong' : 'bonger'}
		</p>
	{/if}
</div>