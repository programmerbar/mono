<script lang="ts">
	import { urlFor } from '$lib/data/sanity/image';

	let { data } = $props();
	let {
		product: {
			name,
			description,
			producer,
			priceList,
			image,
			productTypes,
			variants,
			volume,
			alcoholContent
		}
	} = data;
</script>

<svelte:head>
	<title>{name} — Programmerbar</title>
</svelte:head>

<div class="flex flex-col md:flex-row md:space-x-6">
	<div class="md:w-2/3 p-6 bg-background h-fit rounded-xl border-2 shadow-xl space-y-6">
		<h1 class="text-3xl font-semibold text-gray-900">{name}</h1>

		{#each (description ?? '').split('\n') as paragraph}
			<p class="text-lg text-gray-600">{paragraph}</p>
		{/each}

		<div>
			<h2 class="text-xl font-semibold mb-2">Detaljer</h2>
			<ul>
				{#if producer}
					<li>
						<p class="text-lg">Produsent: {producer}</p>
					</li>
				{/if}
				<li>
					<p class="text-lg">Ordinær pris: {priceList.ordinary} kr</p>
				</li>
				<li>
					<p class="text-lg">Studentpris: {priceList.student} kr</p>
				</li>
				{#if volume}
					<li>
						<p class="text-lg">Volum: {volume} L</p>
					</li>
				{/if}
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
				{#if alcoholContent}
					<li>
						<p class="text-lg">Alkoholinnhold: {alcoholContent}%</p>
					</li>
				{/if}
			</ul>
		</div>
	</div>

	{#if image}
		<div class="md:w-1/3 mt-6 md:mt-0 bg-background h-fit rounded-xl border-2 shadow-xl">
			<img
				class="w-full h-64 md:h-auto object-contain bg-white rounded-xl"
				src={urlFor(image).height(800).width(800).url()}
				alt={name}
			/>
		</div>
	{/if}
</div>
