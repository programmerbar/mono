<script lang="ts">
	let { data } = $props();
	let {
		product: { _id, name, producer, price, image, productTypes, variants, volume }
	} = data;
</script>

<svelte:head>
	<title>{name} — Programmerbar</title>
</svelte:head>

<div class="flex flex-col md:flex-row md:space-x-6">
	<div class="md:w-2/3 p-6 bg-background rounded-xl border-2 border-black shadow-xl space-y-6">
		<h1 class="text-3xl font-semibold text-gray-900">{name}</h1>
		<div>
			<h2 class="text-xl font-semibold mb-2">Detaljer</h2>
			<ul>
				<li>
					<p class="text-lg">Produsent: {producer}</p>
				</li>
				<li>
					<p class="text-lg">Pris: {price} kr</p>
				</li>
				<li>
					<p class="text-lg">Volum: {volume} L</p>
				</li>
				{#if productTypes && productTypes.length > 0}
					<li>
						<p class="text-lg">Type: {productTypes.map((type) => type.title).join(', ')}</p>
					</li>
				{/if}
				{#if variants && variants.length > 0}
					<li>
						<p class="text-lg">Varianter: {variants.join(', ')}</p>
					</li>
				{/if}
			</ul>
		</div>
	</div>

	<div class="md:w-1/3 mt-6 md:mt-0 bg-background rounded-xl border-2 border-black shadow-xl">
		<img class="w-full h-64 md:h-auto object-contain bg-white rounded-xl" src={image} alt={name} />
	</div>
</div>
