<script lang="ts">
	import ContactForm from '$lib/components/app/landing/ContactForm.svelte';
	import EventList from '$lib/components/app/landing/EventList.svelte';
	import Hero from '$lib/components/app/landing/Hero.svelte';
	import Map from '$lib/components/app/landing/Map.svelte';
	import MenuList from '$lib/components/app/landing/MenuList.svelte';

	let { data } = $props();
	let { products, events } = $derived(data);
</script>

<svelte:head>
	<title>Programmerbar</title>
	<meta
		name="description"
		content="Programmerbar er en studentbar for teknologistudenter på Universitet i Bergen."
	/>
	<meta
		name="keywords"
		content="studentbar, programmerbar, universitet i bergen, teknologistudenter"
	/>
</svelte:head>

<Hero />

<div class="space-y-16 py-8">
	<section class="mx-auto grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
		<MenuList {products} />
		<EventList {events} />
	</section>

	<section class="mx-auto grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
		<ContactForm />
		<Map />
	</section>
</div>
