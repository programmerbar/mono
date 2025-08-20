<script lang="ts">
	import { urlFor } from '$lib/api/sanity/image';
	import { Heart } from '@lucide/svelte';
	import type { filterProducts } from '$lib/filter-products';
	import type { FilterState } from '$lib/states/filter-state.svelte';
	import { WishlistState } from '$lib/states/wishlist-state.svelte';
	import Chip from '$lib/components/ui/Chip.svelte';

	type Props = {
		product: ReturnType<typeof filterProducts>[number];
		filterState: FilterState;
		alwaysShowCreditPrice?: boolean;
		disableLink?: boolean;
		disableWishlist?: boolean;
	};

	let {
		product = $bindable(),
		filterState = $bindable(),
		alwaysShowCreditPrice = false,
		disableLink = false,
		disableWishlist = false
	}: Props = $props();

	let wishlist = new WishlistState();
	let isWishlisted = $derived.by(() => wishlist.products.includes(product._id));

	const handleHeartClick = () => {
		if (disableWishlist) return;

		if (isWishlisted) {
			wishlist.remove(product._id);
		} else {
			wishlist.add(product._id);
		}
	};
</script>

<div
	class="bg-background group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 shadow-lg transition-all duration-300 hover:shadow-xl"
>
	<div class="relative overflow-hidden">
		{#if !disableWishlist}
			<div
				class="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white"
			>
				<button
					onclick={handleHeartClick}
					aria-label={isWishlisted ? 'Remove from favorites' : 'Add to favorites'}
					class="flex items-center justify-center"
				>
					{#if isWishlisted}
						<Heart class="h-4 w-4 fill-red-500 stroke-red-500" />
					{:else}
						<Heart class="h-4 w-4 stroke-gray-600 transition-colors hover:stroke-red-500" />
					{/if}
				</button>
			</div>
		{/if}

		{#if product.isSoldOut}
			<div
				class="absolute top-3 left-3 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-md"
			>
				Utsolgt
			</div>
		{/if}
		{#if product.image}
			{#if !disableLink}
				<a href="/produkt/{product._id}" class="block">
					<img
						src={urlFor(product.image).width(500).url()}
						alt={product.name}
						class="h-56 w-full bg-white object-contain object-center transition-all duration-500 group-hover:scale-105"
					/>
				</a>
			{:else}
				<img
					src={urlFor(product.image).width(500).url()}
					alt={product.name}
					class="h-56 w-full bg-white object-contain object-center transition-all duration-500 group-hover:scale-105"
				/>
			{/if}
		{:else}
			<div
				class="flex h-56 w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
				aria-label="No image available"
			>
				<span class="text-sm font-medium text-gray-400">Ingen bilde</span>
			</div>
		{/if}
	</div>

	<div class="flex min-h-[140px] flex-1 flex-col p-4">
		{#if disableLink}
			<div class="flex flex-1 flex-col">
				<h2 class="mb-1 text-lg leading-tight font-semibold">{product.name}</h2>
				<div class="mb-3 flex flex-col gap-1">
					{#if product.producer}
						<p class="text-sm font-medium text-gray-600">{product.producer}</p>
					{/if}
					{#if product.productTypes}
						<div class="flex flex-wrap gap-1">
							{#each product.productTypes as type (type._id)}
								<Chip label={type.title} />
							{/each}
						</div>
					{/if}
				</div>
				<div class="mt-auto">
					{#if alwaysShowCreditPrice || filterState.showCreditPrice}
						{@const credits = product.priceList.credits || 0}
						{@const unit = credits === 1 ? 'bong' : 'bonger'}
						<p class="text-xl font-bold text-black">
							{credits === 0 ? 'Gratis' : `${credits} ${unit}`}
						</p>
					{:else if filterState.showStudentPrice}
						<p class="text-xl font-bold text-black">
							{product.priceList.student === 0 ? 'Gratis' : `${product.priceList.student} kr`}
						</p>
					{:else}
						<p class="text-xl font-bold text-black">
							{product.priceList.ordinary === 0 ? 'Gratis' : `${product.priceList.ordinary} kr`}
						</p>
					{/if}
				</div>
			</div>
		{:else}
			<a class="group-content flex flex-1 flex-col" href="/produkt/{product._id}">
				<h2
					class="group-hover:text-primary mb-1 text-lg leading-tight font-semibold transition-colors"
				>
					{product.name}
				</h2>
				<div class="mb-3 flex flex-col gap-1">
					{#if product.producer}
						<p class="text-sm font-medium text-gray-600">{product.producer}</p>
					{/if}
					{#if product.productTypes}
						<div class="flex flex-wrap gap-1">
							{#each product.productTypes as type (type._id)}
								<Chip label={type.title} />
							{/each}
						</div>
					{/if}
				</div>
				<div class="mt-auto">
					{#if alwaysShowCreditPrice || filterState.showCreditPrice}
						{@const credits = product.priceList.credits || 0}
						{@const unit = credits === 1 ? 'bong' : 'bonger'}
						<p class="text-xl font-bold text-black">
							{credits === 0 ? 'Gratis' : `${credits} ${unit}`}
						</p>
					{:else if filterState.showStudentPrice}
						<p class="text-xl font-bold text-black">
							{product.priceList.student === 0 ? 'Gratis' : `${product.priceList.student} kr`}
						</p>
					{:else}
						<p class="text-xl font-bold text-black">
							{product.priceList.ordinary === 0 ? 'Gratis' : `${product.priceList.ordinary} kr`}
						</p>
					{/if}
				</div>
			</a>
		{/if}
	</div>
</div>
