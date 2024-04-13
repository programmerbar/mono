<script lang="ts">
	let { data } = $props();

	const MAX = 12;
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

<div class="bg-primary min-h-screen flex flex-col p-6">
	<div class="bg-background p-4 flex-1 rounded-xl flex flex-col shadow-xl border">
		<div class="mb-10 flex items-center justify-between p-4">
			<h1 class="text-6xl italic">Vår meny</h1>

			<p class="text-2xl font-medium">{page + 1} / {TOTAL_PAGES}</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each data.products.slice(start, end) as { name, producer, price }}
				<div class="flex items-center justify-between bg-neutral-50 p-6 border-2">
					<div class="flex flex-col">
						<p class="text-2xl">{name}</p>
						<p class="text-gray-700">{producer}</p>
					</div>

					<div>
						<p class="font-medium text-2xl italic">{price} kr</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
