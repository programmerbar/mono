<script lang="ts">
	let { data } = $props();

	const MAX = 10;
	const TOTAL_PAGES = Math.ceil(data.products.length / MAX);
	let page = $state(0);

	$effect(() => {
		const interval = setInterval(() => {
			page = (page + 1) % TOTAL_PAGES;
		}, 5000);

		return () => clearInterval(interval);
	});

	const start = $derived(page * MAX);
	const end = $derived(start + MAX);
</script>

<svelte:head>
	<title>Screen — Programmerbar</title>
</svelte:head>

<div class="bg-primary min-h-screen flex flex-col p-6">
	<div class="bg-background p-4 flex-1 rounded-xl flex flex-col shadow-xl border">
		<div class="mb-10 flex items-center justify-between p-4">
			<h1 class="text-7xl italic font-mono font-medium">Vår meny</h1>

			<p class="text-2xl font-medium">{page + 1} / {TOTAL_PAGES}</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 justify-center items-center">
			{#each data.products.slice(start, end) as { name, producer, price }}
				<div class="flex items-center justify-between h-full rounded-xl bg-neutral-50 p-6 border-2">
					<div class="flex flex-col">
						<p class="text-4xl">{name}</p>
						<p class="text-gray-700 text-lg font-mono">{producer}</p>
					</div>

					<div>
						<p class="text-4xl font-light italic">{price} kr</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
