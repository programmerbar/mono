<script lang="ts">
	import { urlFor } from '$lib/data/sanity/image';
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
		<div class="relative flex-1">
			{#key page}
				<div
					class="absolute w-full grid grid-cols-1 md:grid-cols-2 gap-4 justify-center items-center h-full"
					in:fly={{ x: 100, duration: 500 }}
					out:fly={{ x: -100, duration: 500 }}
				>
					{#each current as { name, producer, image, priceList: { student } }}
						<div class="flex items-center rounded-xl h-full bg-neutral-50 border-2 overflow-hidden">
							{#if image}
								<div class="h-full border-r bg-white flex items-center justify-center">
									<img
										src={urlFor(image).height(600).width(600).url()}
										alt={name}
										class="w-auto h-52"
									/>
								</div>
							{/if}

							<div class="flex items-center justify-between px-6 flex-1">
								<div class="flex flex-col gap-2">
									<p class="text-6xl truncate font-light">{name}</p>
									<p class="text-gray-700 text-2xl font-mono">{producer}</p>
								</div>

								<p class="text-6xl font-light italic text-nowrap">{student} kr</p>
							</div>
						</div>
					{/each}
				</div>
			{/key}
		</div>

		<div class="flex flex-row items-center gap-2 mx-auto pt-5">
			{#each Array.from({ length: TOTAL_PAGES }) as _p, i}
				<button onclick={() => (page = i)}>
					<div
						class="w-6 h-6 rounded-full bg-background border-[var(--theme-color)] border-2"
						class:active={i === page}
					></div>
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	.active {
		background-color: var(--theme-color);
	}
</style>
