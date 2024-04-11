<script lang="ts">
	let { data } = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-10">
	{#each data.products as { name, price, producer, image, variants }}
		<div class="border-2 border-black rounded-lg overflow-hidden">
			{#if image}
				<img src={image} alt={name} class="w-24 h-24 object-cover rounded-lg" />
			{:else}
				<div class="h-48 w-full border-b-2 border-b-black bg-gray-200"></div>
			{/if}
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
