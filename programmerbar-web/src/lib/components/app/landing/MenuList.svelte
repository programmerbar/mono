<script lang="ts">
	import type { GetProductsQueryResult } from '../../../../../sanity.types';
	import { resolve } from '$app/paths';

	type Props = {
		products: GetProductsQueryResult;
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

<div class="bg-background rounded-2xl border-2 p-6 shadow-lg">
	<h2 class="mb-6 text-center font-mono text-3xl font-medium md:text-4xl">
		<a href={resolve('/meny')} class="hover:underline">Meny</a>
	</h2>

	<ul class="flex flex-col gap-3 overflow-hidden">
		{#each products.slice(start, end) as { _id, name, producer, priceList } (_id)}
			<li class="group">
				<a href={resolve('/(app)/produkt/[id]', { id: _id })} class="block">
					<div
						class="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all duration-300"
					>
						<div class="flex items-center justify-between">
							<div class="min-w-0 flex-1">
								<h3
									class="group-hover:text-primary mb-1 text-lg leading-tight font-semibold text-gray-900 transition-colors duration-200"
								>
									{name}
								</h3>
								<p class="font-mono text-sm font-medium text-gray-600">
									{producer}
								</p>
							</div>
							<div class="ml-4 flex items-center gap-3">
								<p class="text-lg font-bold text-black">
									{priceList.student === 0 ? 'Gratis' : `${priceList.student} kr`}
								</p>
								<div class="group-hover:text-primary text-gray-400 transition-colors duration-200">
									<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

	<div class="mt-6 border-t border-gray-200 pt-4">
		<p class="flex items-center justify-center gap-2 text-center text-sm font-medium text-gray-600">
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
				/>
			</svg>
			Side {currentPage + 1} / {TOTAL_PAGES}
		</p>
	</div>
</div>
