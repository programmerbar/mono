<script lang="ts">
	import { urlFor } from '$lib/api/sanity/image';
	import { Heart } from '@lucide/svelte';
	import type { filterProducts } from '$lib/filter-products';
	import type { FilterState } from '$lib/states/filter-state.svelte';
	import { WishlistState } from '$lib/states/wishlist-state.svelte';

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
	class="bg-background relative flex h-full flex-col overflow-hidden rounded-xl border-2 shadow-md"
>
	<div class="relative border-b-2 overflow-hidden">
		{#if !disableWishlist}
			<div class="absolute top-0 right-0 z-10 rounded-bl bg-white px-2 py-1 text-xs font-semibold">
				<button
					onclick={handleHeartClick}
					aria-label={isWishlisted ? 'Remove from favorites' : 'Add to favorites'}
				>
					{#if isWishlisted}
						<Heart class="fill-red-500 stroke-red-200" />
					{:else}
						<Heart class="stroke-red-500" />
					{/if}
				</button>
			</div>
		{/if}

		{#if product.isSoldOut}
			<div
				class="absolute top-0 left-0 rounded-br bg-red-500 px-2 py-1 text-xs font-semibold text-white"
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
						class="h-48 w-full bg-white object-contain object-center transition-transform duration-300 hover:scale-110"
					/>
				</a>
			{:else}
				<img
					src={urlFor(product.image).width(500).url()}
					alt={product.name}
					class="h-48 w-full bg-white object-contain object-center transition-transform duration-300 hover:scale-110"
				/>
			{/if}
		{:else}
			<div class="h-48 w-full bg-gray-200" aria-label="No image available"></div>
		{/if}
	</div>

	{#if disableLink}
		<div class="flex flex-1 flex-col p-2">
			<h2 class="text-lg font-semibold">{product.name}</h2>
			{#if product.producer}
				<p class="text-sm text-gray-800">{product.producer}</p>
			{/if}
			{#if product.productTypes}
				<p class="text-sm text-gray-800">
					{product.productTypes.map((type) => type.title).join(', ')}
				</p>
			{/if}
			{#if alwaysShowCreditPrice || filterState.showCreditPrice}
				{@const unit = product.priceList.credits === 1 ? 'bong' : 'bonger'}
				<p class="mt-auto text-lg font-semibold">{product.priceList.credits || 0} {unit}</p>
			{:else if filterState.showStudentPrice}
				<p class="mt-auto text-lg font-semibold">{product.priceList.student} kr</p>
			{:else}
				<p class="mt-auto text-lg font-semibold">{product.priceList.ordinary} kr</p>
			{/if}
		</div>
	{:else}
		<a class="group" href="/produkt/{product._id}">
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
				{#if alwaysShowCreditPrice || filterState.showCreditPrice}
					{@const unit = product.priceList.credits === 1 ? 'bong' : 'bonger'}
					<p class="mt-auto text-lg font-semibold">{product.priceList.credits || 0} {unit}</p>
				{:else if filterState.showStudentPrice}
					<p class="mt-auto text-lg font-semibold">{product.priceList.student} kr</p>
				{:else}
					<p class="mt-auto text-lg font-semibold">{product.priceList.ordinary} kr</p>
				{/if}
			</div>
		</a>
	{/if}
</div>
