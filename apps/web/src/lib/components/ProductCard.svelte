<script lang="ts">
	import type { Product } from '$lib/types';
	import { Martini } from 'lucide-svelte';

	type Props = {
		product: Product;
	};

	const { product }: Props = $props();
	const { name, image, price, producer, variants, isSoldOut } = product;
</script>

<li class="border-2 border-black rounded-xl overflow-hidden bg-background shadow-xl relative">
	{#if isSoldOut}
		<div
			class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center"
		>
			<p class="text-white text-4xl rotate-45 font-medium">Utsolgt</p>
		</div>
	{/if}

	<div class="border-b-2 border-b-black">
		{#if image}
			<img src={image} alt={name} class="w-full bg-white h-48 object-contain" />
		{:else}
			<div class="h-48 w-full bg-gray-200 flex items-center justify-center">
				<Martini class="text-gray-500 h-16 w-16" />
			</div>
		{/if}
	</div>

	<div class="p-4">
		<h2 class="text-2xl font-medium">
			{name}
		</h2>
		{#if variants && variants.length > 1}
			<p class="text-sm text-gray-700">({variants.join(', ')})</p>
		{/if}
		<p class="text-lg">{price} kr</p>
		<p class="text-sm text-gray-700 font-mono font-medium">{producer}</p>
	</div>
</li>
