<script lang="ts">
	import ContactUs from '$lib/components/ContactUs.svelte';
	import StatusLabel from '$lib/components/StatusLabel.svelte';
	import { createTypewriteCycle } from '$lib/stores/typewrite-cycle.svelte';
	import { format } from 'date-fns';
	import { nb } from 'date-fns/locale/nb';

	const { data } = $props();

	const MAX = 6;
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

	const cycle = createTypewriteCycle(
		['programmerbar', 'lesesalen', 'hjem', 'beste baren', 'god stemning', 'ballmer peak'],
		500
	);
</script>

<svelte:head>
	<title>Hjem — Programmerbar</title>
	<meta
		name="description"
		content="Programmerbar er studentbar ved Institutt for informatikk på Universitetet i Bergen. Du finner oss på bachelor lesesalen på høyteknologisenteret."
	/>
</svelte:head>

<div class="pb-24 pt-16 space-y-8">
	<StatusLabel status={data.status.status}>
		{data.status.message}
	</StatusLabel>

	<h1 class="text-[min(80px,8vw)] text-center flex flex-col gap-6">
		<span class="font-mono w-fit mx-auto px-6 font-light rounded-xl py-4">$ {cycle.text}</span>
	</h1>

	<div class="flex justify-center">
		<a
			class="px-6 py-2 text-lg rounded border-2 shadow-lg bg-secondary hover:bg-secondary-dark font-medium"
			href="/booking">Book nå!</a
		>
	</div>

	<div
		class="rounded-xl bg-background max-w-[400px] mx-auto w-fit p-3 text-center text-sm text-gray-700 shadow-xl border-2"
	>
		<span
			>👋🏻 Hei! Hvordan kan vi gjøre nettsiden bedre? Gjerne send en e-post til <a
				class="underline text-blue-400 hover:no-underline"
				href="mailto:omfj@echo.uib.no">omfj@echo.uib.no</a
			> med forslag!</span
		>
	</div>
</div>

<div class="py-10 grid grid-cols-1 md:grid-cols-2 gap-4">
	<div class="bg-background rounded-xl shadow-xl border-2 p-2">
		<h2 class="text-center font-medium font-mono text-3xl md:text-4xl py-6">
			<a href="/meny" class="hover:underline">Meny</a>
		</h2>
		<ul class="divide-y-2 overflow-hidden">
			{#each data.products.slice(start, end) as { _id, name, producer, priceList }}
				<li>
					<a href="/produkt/{_id}" class="group">
						<div class="h-16 px-2 flex items-center justify-between hover:bg-primary-light">
							<div class="flex flex-col">
								<p class="text-xl group-hover:underline">{name}</p>
								<p class="text-sm font-medium font-mono text-gray-700">{producer}</p>
							</div>

							<div>
								<p class="font-medium">{priceList.student} kr</p>
							</div>
						</div>
					</a>
				</li>
			{/each}
		</ul>

		<p class="text-center text-sm font-medium my-2">Side {page + 1} / {TOTAL_PAGES}</p>
	</div>

	<div class="bg-background rounded-xl shadow-xl border-2 p-2">
		<h2 class="text-center font-medium font-mono text-3xl md:text-4xl py-6">Arrangementer</h2>
		<ul class="divide-y-2 overflow-hidden">
			{#each data.events as { title, start, slug }}
				<li>
					<a href="/arrangement/{slug}" class="text-xl group">
						<div class="h-16 px-2 flex flex-col justify-center hover:bg-primary-light">
							<p class="group-hover:underline">{title}</p>

							<p class="text-sm font-medium font-mono text-gray-700">
								{format(new Date(start), 'EEEE d. MMMM', { locale: nb })}
							</p>
						</div>
					</a>
				</li>
			{:else}
				<li>
					<p class="text-center text-lg font-medium p-2">Ingen kommende arrangementer</p>
				</li>
			{/each}
		</ul>
	</div>
</div>

<ContactUs />
