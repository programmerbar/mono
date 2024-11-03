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
		class="relative flex h-full flex-col overflow-hidden rounded-xl border-2 bg-background shadow-md"
	>
		<div class="relative border-b-2">
			{#if product.isSoldOut}
				<div
					class="absolute left-0 top-0 rounded-br bg-red-500 px-2 py-1 text-xs font-semibold text-white"
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
		<div class="flex flex-1 flex-col p-2">
			<h2 class="text-lg font-semibold group-hover:underline">{product.name}</h2>

			{#if product.producer}
				<p class="text-sm text-gray-800">{product.producer}</p>
			{/if}

			{#if product.productTypes}
				<p class="text-sm text-gray-800">
					{product.productTypes.map((type) => type.title).join(', ')}
				</p>
			{/if}

			{#if filterState.showStudentPrice}
				<p class="mt-auto text-lg font-semibold">{product.priceList.student} kr</p>
			{:else}
				<p class="mt-auto text-lg font-semibold">{product.priceList.ordinary} kr</p>
			{/if}
		</div>
	</div>
</a>
