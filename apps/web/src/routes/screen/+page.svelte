<script lang="ts">
	import { fly } from 'svelte/transition';

	let { data } = $props();

	const products = data.products.filter((product) => !product.isSoldOut);
	const MAX = data.count;
	const TOTAL_PAGES = Math.ceil(products.length / MAX);

	let page = $state(0);

	$effect(() => {
		const interval = setInterval(() => {
			page = (page + 1) % TOTAL_PAGES;
		}, data.delay * 1000);

		return () => clearInterval(interval);
	});

	let start = $derived(page * MAX);
	let end = $derived(start + MAX);
	let current = $derived(products.slice(start, end));
</script>

<svelte:head>
	<title>Screen — Programmerbar</title>
</svelte:head>

<div
	style="--theme-color: {data.color}; background-color: var(--theme-color)"
	class="min-h-screen flex flex-col p-6"
>
	<div class="bg-background p-4 overflow-hidden flex-1 rounded-xl flex flex-col shadow-xl border">
		<div class="mb-10 flex items-center justify-between p-4">
			<h1 class="text-7xl italic font-mono font-medium">Vår meny</h1>

			<div class="flex flex-row items-center gap-2">
				{#each Array.from({ length: TOTAL_PAGES }) as _, i}
					<div
						class="w-6 h-6 rounded-full bg-background border-[var(--theme-color)] border-2"
						class:active={i === page}
					></div>
				{/each}
			</div>
		</div>

		<div class="relative">
			{#key page}
				<div
					class="absolute w-full grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 justify-center items-center"
					in:fly={{ x: 50, duration: 500 }}
					out:fly={{ x: -50, duration: 500 }}
				>
					{#each current as { name, producer, priceList: { student } }}
						<div
							class="flex items-center justify-between h-full rounded-xl bg-neutral-50 p-6 border-2"
						>
							<div class="flex flex-col">
								<p class="text-4xl">{name}</p>
								<p class="text-gray-700 text-lg font-mono">{producer}</p>
							</div>

							<div>
								<p class="text-4xl font-light italic">{student} kr</p>
							</div>
						</div>
					{/each}
				</div>
			{/key}
		</div>
	</div>
</div>

<style>
	.active {
		background-color: var(--theme-color);
	}
</style>
