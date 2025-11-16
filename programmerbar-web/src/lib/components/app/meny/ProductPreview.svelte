<script lang="ts">
	import { urlFor } from '$lib/api/sanity/queries';
	import { resolve } from '$app/paths';
	import { filterProducts } from '$lib/utils/products';
	import type { FilterState } from '$lib/states/filter-state.svelte';
	import CLIChip from './CLIChip.svelte';

	type Product = ReturnType<typeof filterProducts>[number];
	type Props = {
		product: Product;
		filter: FilterState;
		alwaysShowCreditPrice?: boolean;
		disableLink?: boolean;
	};

	let {
		product = $bindable(),
		filter = $bindable(),
		alwaysShowCreditPrice = false,
		disableLink = false
	}: Props = $props();
</script>

<div
	class="bg-card group border-border hover:border-primary relative flex h-full flex-col overflow-hidden border-2 font-mono transition-all duration-300"
>
	<div class="relative h-56 overflow-hidden">
		<!-- Sold out overlay -->
		{#if product.isSoldOut}
			<div class="text-accent-error absolute top-3 left-3 z-10 font-mono text-sm leading-tight">
				<div class="text-foreground-muted">&gt; exit 1</div>
				<div class="font-semibold">error: utsolgt</div>
			</div>
		{/if}

		{#if product.image}
			{#if !disableLink}
				<a
					href={resolve('/(app)/produkt/[id]', { id: product._id })}
					class="block h-full w-full overflow-hidden"
				>
					<img
						src={urlFor(product.image).width(500).url()}
						alt={product.name}
						class="bg-card h-full w-full border-0 object-contain object-center"
						style="display: block;"
					/>
				</a>
			{:else}
				<img
					src={urlFor(product.image).width(500).url()}
					alt={product.name}
					class="bg-card h-full w-full border-0 object-contain object-center"
					style="display: block;"
				/>
			{/if}
		{:else}
			<div
				class="from-muted-light to-border-light flex h-full w-full items-center justify-center bg-linear-to-br"
				aria-label="No image available"
			>
				<span class="text-foreground-subtle text-sm font-medium">Ingen bilde</span>
			</div>
		{/if}
	</div>

	<div class="flex min-h-[140px] flex-1 flex-col p-4">
		{#if disableLink}
			<div class="flex flex-1 flex-col">
				<h2 class="mb-1 text-lg leading-tight font-semibold">{product.name}</h2>
				<div class="mb-3 flex flex-col gap-1">
					{#if product.producer}
						<p class="text-foreground-secondary text-sm font-medium">{product.producer}</p>
					{/if}
					{#if product.productTypes}
						<div class="flex flex-wrap gap-1">
							{#each product.productTypes as type (type._id)}
								<CLIChip label={type.title} />
							{/each}
						</div>
					{/if}
				</div>
				<div class="mt-auto">
					{#if alwaysShowCreditPrice || filter.current.showCreditPrice}
						{@const credits = product.priceList.credits || 0}
						{@const unit = credits === 1 ? 'bong' : 'bonger'}
						<p class="text-foreground-primary text-xl font-bold">
							{credits === 0 ? 'Gratis' : `${credits} ${unit}`}
						</p>
					{:else if filter.current.showStudentPrice}
						<p class="text-foreground-primary text-xl font-bold">
							{product.priceList.student === 0 ? 'Gratis' : `${product.priceList.student} kr`}
						</p>
					{:else}
						<p class="text-foreground-primary text-xl font-bold">
							{product.priceList.ordinary === 0 ? 'Gratis' : `${product.priceList.ordinary} kr`}
						</p>
					{/if}
				</div>
			</div>
		{:else}
			<a
				class="group-content flex flex-1 flex-col"
				href={resolve('/(app)/produkt/[id]', { id: product._id })}
			>
				<h2
					class="group-hover:text-primary mb-1 text-lg leading-tight font-semibold transition-colors"
				>
					{product.name}
				</h2>
				<div class="mb-3 flex flex-col gap-1">
					{#if product.producer}
						<p class="text-foreground-secondary text-sm font-medium">{product.producer}</p>
					{/if}
					{#if product.productTypes}
						<div class="flex flex-wrap gap-1">
							{#each product.productTypes as type (type._id)}
								<CLIChip label={type.title} />
							{/each}
						</div>
					{/if}
				</div>
				<div class="mt-auto">
					{#if alwaysShowCreditPrice || filter.current.showCreditPrice}
						{@const credits = product.priceList.credits || 0}
						{@const unit = credits === 1 ? 'bong' : 'bonger'}
						<p class="text-foreground-primary text-xl font-bold">
							{credits === 0 ? 'Gratis' : `${credits} ${unit}`}
						</p>
					{:else if filter.current.showStudentPrice}
						<p class="text-foreground-primary text-xl font-bold">
							{product.priceList.student === 0 ? 'Gratis' : `${product.priceList.student} kr`}
						</p>
					{:else}
						<p class="text-foreground-primary text-xl font-bold">
							{product.priceList.ordinary === 0 ? 'Gratis' : `${product.priceList.ordinary} kr`}
						</p>
					{/if}
				</div>
			</a>
		{/if}
	</div>
</div>
