<script lang="ts">
	import { Martini } from 'lucide-svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Meny</title>
</svelte:head>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-10">
	{#each data.products as { name, price, producer, image, variants }}
		<div class="border-2 border-black rounded-xl overflow-hidden bg-background shadow-xl">
			<div class="border-b-2 border-b-black">
				{#if image}
					<img src={image} alt={name} class="w-full h-48 object-cover" />
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
				<p class="text-sm text-gray-700">{producer}</p>
			</div>
		</div>
	{/each}
</div>
