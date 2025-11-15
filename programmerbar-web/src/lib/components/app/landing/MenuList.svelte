<script lang="ts">
	import type { GET_PRODUCTS_QUERYResult } from '@programmerbar/cms/types';
	import { resolve } from '$app/paths';
	import { urlFor } from '$lib/api/sanity/queries';

	type Props = {
		products: GET_PRODUCTS_QUERYResult;
	};

	let { products }: Props = $props();

	const INTERVAL = 5000;
	const MAX = 6;
	const TOTAL_PAGES = Math.ceil(products.length / MAX);

	let currentPage = $state(0);
	let start = $derived(currentPage * MAX);
	let end = $derived(start + MAX);

	$effect(() => {
		const interval = setInterval(() => {
			currentPage = (currentPage + 1) % TOTAL_PAGES;
		}, INTERVAL);

		return () => clearInterval(interval);
	});
</script>

<div class="bg-background rounded-2xl border-2 p-6 md:p-8">
	<div class="mb-8 flex items-center justify-between">
		<h2 class="font-mono text-3xl font-medium md:text-4xl">
			<a href={resolve('/meny')} class="transition-colors hover:text-gray-600">Meny</a>
		</h2>
		{#if TOTAL_PAGES > 1}
			<div class="flex items-center gap-2">
				{#each Array(TOTAL_PAGES) as _, i}
					<button
						onclick={() => (currentPage = i)}
						class="h-2 rounded-full transition-all duration-300 {i === currentPage
							? 'w-8 bg-gray-700'
							: 'w-2 bg-gray-300 hover:bg-gray-400'}"
						aria-label="Side {i + 1}"
					></button>
				{/each}
			</div>
		{/if}
	</div>

	<ul class="flex flex-col gap-4 overflow-hidden">
		{#each products.slice(start, end) as product (product._id)}
			{@const { _id, name, producer, priceList, image } = product}
			<li class="group">
				<a href={resolve('/(app)/produkt/[id]', { id: _id })} class="block">
					<div
						class="relative overflow-hidden rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 transition-all duration-300 hover:border-gray-300"
					>
						<div class="flex items-center gap-4">
							{#if image}
								<div class="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
									<img
										src={urlFor(image).width(100).height(100).url()}
										alt={name}
										class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
									/>
								</div>
							{:else}
								<div
									class="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200"
								>
									<svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
										/>
									</svg>
								</div>
							{/if}

							<div class="min-w-0 flex-1">
								<h3
									class="mb-1 text-lg font-bold leading-tight text-gray-900 transition-colors duration-200 group-hover:text-gray-700"
								>
									{name}
								</h3>
								<p class="font-mono text-sm font-medium text-gray-500">
									{producer}
								</p>
							</div>

							<div class="flex shrink-0 items-center gap-3">
								<div class="text-right">
									<p class="text-xl font-bold text-gray-900">
										{priceList.student === 0 ? 'Gratis' : `${priceList.student} kr`}
									</p>
								</div>
								<div class="text-gray-300 transition-colors duration-200 group-hover:text-gray-500">
									<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</div>
							</div>
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>

	{#if TOTAL_PAGES > 1}
		<div class="mt-6 flex items-center justify-center gap-2 border-t border-gray-200 pt-4">
			<svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
				/>
			</svg>
			<p class="text-sm font-medium text-gray-600">
				Side {currentPage + 1} av {TOTAL_PAGES}
			</p>
		</div>
	{/if}
</div>
