<script lang="ts">
	import type { GetProductsQueryResult } from '../../../../../sanity.types';

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

<div class="rounded-xl border-2 bg-background p-2 shadow-md">
	<h2 class="py-6 text-center font-mono text-3xl font-medium md:text-4xl">
		<a href="/meny" class="hover:underline">Meny</a>
	</h2>

	<ul class="flex flex-col divide-y overflow-hidden">
		{#each products.slice(start, end) as { _id, name, producer, priceList }}
			<li class="py-1">
				<a href="/produkt/{_id}" class="group overflow-hidden">
					<div
						class="flex h-16 items-center justify-between rounded-xl px-4 py-2 transition-all hover:bg-primary-light"
					>
						<div class="flex flex-col">
							<p class="text-lg group-hover:underline md:text-xl">{name}</p>
							<p class="font-mono text-sm font-medium text-gray-700 md:text-sm">{producer}</p>
						</div>

						<div>
							<p class="font-medium">{priceList.student} kr</p>
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>

	<p class="my-2 text-center text-sm font-medium">
		Side {currentPage + 1} / {TOTAL_PAGES}
	</p>
</div>
