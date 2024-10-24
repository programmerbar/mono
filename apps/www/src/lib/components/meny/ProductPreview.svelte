<script lang="ts">
	import { urlFor } from '$lib/api/sanity/image';
	import type { filterProducts } from '$lib/filter-products';
	import type { FilterState } from '$lib/states/filter-state.svelte';

	type Props = {
		product: ReturnType<typeof filterProducts>[number];
		filterState: FilterState;
	};

	let { product = $bindable(), filterState = $bindable() }: Props = $props();
</script>

<a class="group" href="/produkt/{product._id}">
	<div
		class="relative flex flex-col overflow-hidden h-full rounded-xl border-2 bg-background shadow-md"
	>
		<div class="relative border-b-2">
			{#if product.isSoldOut}
				<div
					class="absolute top-0 left-0 bg-red-500 text-white text-xs font-semibold py-1 px-2 rounded-br"
				>
					Utsolgt
				</div>
			{/if}

			{#if product.image}
				<img
					src={urlFor(product.image).width(500).height(500).url()}
					alt={product.name}
					class="h-48 w-full bg-white object-contain"
				/>
			{:else}
				<div class="h-48 w-full bg-gray-200"></div>
			{/if}
		</div>
		<div class="p-2 flex flex-col flex-1">
			<h2 class="group-hover:underline text-lg font-semibold">{product.name}</h2>

			{#if product.producer}
				<p class="text-sm text-gray-800">{product.producer}</p>
			{/if}

			{#if product.productTypes}
				<p class="text-sm text-gray-800">
					{product.productTypes.map((type) => type.title).join(', ')}
				</p>
			{/if}

			{#if filterState.showStudentPrice}
				<p class="text-lg font-semibold mt-auto">{product.priceList.student} kr</p>
			{:else}
				<p class="text-lg font-semibold mt-auto">{product.priceList.ordinary} kr</p>
			{/if}
		</div>
	</div>
</a>
