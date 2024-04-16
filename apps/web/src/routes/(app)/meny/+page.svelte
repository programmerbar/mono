<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>Meny — Programmerbar</title>
</svelte:head>

<ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-10">
	{#each data.products as product}
		<ProductCard {product} />
	{/each}
</ul>
