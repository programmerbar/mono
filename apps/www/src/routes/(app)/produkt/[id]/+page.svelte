<script lang="ts">
	import { urlFor } from '$lib/api/sanity/image.js';
	import { marked } from 'marked';

	let { data } = $props();

	const html = marked(data.product.description ?? '');

	const metadata = [
		{ title: 'Produsent', value: data.product.producer ?? 'Ingen' },
		{ title: 'Alkoholinnhold', value: data.product.alcoholContent ?? 'Ukjent' },
		{ title: 'Volum', value: data.product.volume ?? 'Ukjent' },
		{
			title: 'Type',
			value: data.product.productTypes?.map((type) => type.title).join(', ') ?? 'Ingen'
		},
		{ title: 'Pris (Ordinær)', value: data.product.priceList.ordinary },
		{ title: 'Pris (Student)', value: data.product.priceList.student },
		{ title: 'Størrelse', value: data.product.volume },
		{ title: 'Alkoholinnhold', value: data.product.alcoholContent }
	];
</script>

<div class="flex flex-col-reverse md:flex-row md:space-x-6">
	<div class="h-fit space-y-6 rounded-xl border-2 bg-background p-6 shadow-xl md:w-2/3">
		<h1 class="text-3xl font-semibold text-gray-900">{data.product.name}</h1>

		{@html html}

		<div>
			{#each metadata as { title, value }}
				<div class="grid grid-cols-3 w-full border-b last:border-b-0">
					<p class="col-span-1 font-medium">{title}</p>
					<p class="col-span-2">{value}</p>
				</div>
			{/each}
		</div>
	</div>

	{#if data.product.image}
		<div class="mb-6 h-fit rounded-xl border-2 bg-background shadow-xl md:mb-0 md:w-1/3">
			<img
				class="h-64 w-full rounded-xl bg-white object-contain md:h-auto"
				src={urlFor(data.product.image).width(500).height(500).url()}
				alt={data.product.name}
			/>
		</div>
	{/if}
</div>
