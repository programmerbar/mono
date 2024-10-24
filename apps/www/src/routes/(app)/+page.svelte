<script lang="ts">
	import ContactForm from '$lib/components/landing/ContactForm.svelte';
	import EventList from '$lib/components/landing/EventList.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import Map from '$lib/components/landing/Map.svelte';
	import MenuList from '$lib/components/landing/MenuList.svelte';

	let { data } = $props();
	let { products, events, status } = data;
</script>

<Hero {...status} />

<div class="space-y-10">
	<div class="w-full gap-10 grid grid-cols-1 md:grid-cols-2 mx-auto">
		<MenuList {products} />
		<EventList {events} />
	</div>

	<div class="w-full gap-10 grid grid-cols-1 md:grid-cols-2 mx-auto">
		<ContactForm />
		<Map />
	</div>
</div>
