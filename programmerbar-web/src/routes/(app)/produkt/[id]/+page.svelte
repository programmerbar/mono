<script lang="ts">
	import { urlFor } from '$lib/api/sanity/image';
	import { marked } from 'marked';
	import { page } from '$app/state';
	import ProductDetailsCard from '$lib/components/app/product/ProductDetailsCard.svelte';
	import { Image } from '@lucide/svelte';
	import { cn } from '$lib/cn';
	import SEO from '$lib/components/SEO.svelte';

	let { data } = $props();

	const html = marked(data.product.description ?? '');
	const isAuthenticated = $derived(page.data.user);

	const variants = data.product.variants?.map((variant) => variant) ?? [];

	const metadata = [
		{ title: 'Produsent', value: data.product.producer ?? 'Ingen' },
		{
			title: 'Alkoholinnhold',
			value: data.product.alcoholContent ? `${data.product.alcoholContent}%` : 'Ukjent'
		},
		{ title: 'Volum', value: data.product.volume ? `${data.product.volume} l` : 'Ukjent' },
		{
			title: 'Pris (Ordinær)',
			value:
				data.product.priceList.ordinary === 0 ? 'Gratis' : data.product.priceList.ordinary + ' NOK'
		},
		{
			title: 'Pris (Student)',
			value:
				data.product.priceList.student === 0 ? 'Gratis' : data.product.priceList.student + ' NOK'
		},
		...(data.product.priceList.credits && data.product.priceList.credits > 0
			? [{ title: 'Bong pris', value: data.product.priceList.credits }]
			: [])
	];

	let imageLoaded = $state(false);

	// SEO data
	const productImage = data.product.image ? urlFor(data.product.image).width(800).url() : undefined;
	const productDescription =
		data.product.description ||
		`${data.product.name} - ${data.product.producer || 'Ukjent produsent'} - Pris fra ${data.product.priceList.student} kr`;
</script>

<SEO
	title={data.product.name}
	description={productDescription}
	keywords={`${data.product.name}, ${data.product.producer || ''}, øl, drikke, studentpris, programmerbar`}
	canonical={`/produkt/${data.product._id}`}
	image={productImage}
	type="product"
/>

<div class="mx-auto max-w-6xl">
	<!-- Mobile Header - Only visible on mobile -->
	<div class="mb-6 lg:hidden">
		<h1 class="text-3xl font-bold text-gray-900">{data.product.name}</h1>
		{#if variants.length > 0}
			<p class="mt-2 text-lg text-gray-600">
				{variants.join(' • ')}
			</p>
		{/if}
	</div>

	<div class="grid gap-8 lg:grid-cols-2">
		<!-- Left Column: Image and Description -->
		<div class="space-y-6">
			<!-- Product Image with Description -->
			{#if data.product.image}
				<div class="bg-background overflow-hidden rounded-2xl border shadow-lg">
					<div class="relative flex aspect-square items-center justify-center bg-white">
						<!-- Placeholder Icon -->
						{#if !imageLoaded}
							<div class="absolute inset-0 flex items-center justify-center">
								<Image class="h-16 w-16 text-gray-400" />
							</div>
						{/if}

						<!-- Product Image -->
						<img
							class="max-h-full max-w-full object-contain {imageLoaded
								? 'opacity-100'
								: 'opacity-0'} transition-opacity duration-300"
							src={urlFor(data.product.image).width(400).url()}
							alt={data.product.name}
							onload={() => (imageLoaded = true)}
						/>
					</div>

					<!-- Description attached to image -->
					{#if html}
						<div class="border-t bg-white p-6">
							<div class="prose prose-gray max-w-none">{@html html}</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Right Column: Product Details -->
		<div class="space-y-6">
			<!-- Desktop Header - Only visible on desktop -->
			<div class="hidden space-y-2 lg:block">
				<h1 class="text-4xl font-bold text-gray-900">{data.product.name}</h1>
				{#if variants.length > 0}
					<p class="text-lg text-gray-600">
						{variants.join(' • ')}
					</p>
				{/if}
			</div>

			<!-- Pricing -->
			<div class="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
				<div
					class={cn('grid grid-cols-1 gap-4', {
						'sm:grid-cols-3':
							isAuthenticated &&
							data.product.priceList.credits &&
							data.product.priceList.credits > 0,
						'sm:grid-cols-2':
							!isAuthenticated ||
							!data.product.priceList.credits ||
							data.product.priceList.credits <= 0
					})}
				>
					<div class="text-center">
						<p class="text-sm font-medium text-gray-600">Ordinær pris</p>
						<p class="text-2xl font-bold text-gray-900">
							{data.product.priceList.ordinary === 0
								? 'Gratis'
								: `${data.product.priceList.ordinary} kr`}
						</p>
					</div>
					<div class="text-center">
						<p class="text-sm font-medium text-gray-600">Student pris</p>
						<p class="text-2xl font-bold text-blue-600">
							{data.product.priceList.student === 0
								? 'Gratis'
								: `${data.product.priceList.student} kr`}
						</p>
					</div>
					{#if isAuthenticated && data.product.priceList.credits && data.product.priceList.credits > 0}
						<div class="text-center">
							<p class="text-sm font-medium text-gray-600">Bong pris</p>
							<p class="text-2xl font-bold text-indigo-600">
								{#if data.product.priceList.credits === 0}
									Gratis
								{:else}
									{data.product.priceList.credits}
									{data.product.priceList.credits === 1 ? 'bong' : 'bonger'}
								{/if}
							</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Desktop Product Details - Only visible on desktop, under pricing -->
			<ProductDetailsCard details={metadata.slice(0, 4)} class="hidden lg:block" />
		</div>
	</div>

	<!-- Mobile Product Details - Only visible on mobile, at the bottom -->
	<ProductDetailsCard details={metadata.slice(0, 4)} class="mt-8 lg:hidden" />
</div>
