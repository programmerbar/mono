<script lang="ts">
	import { cn } from '$lib/cn';
	import ContactUs from '$lib/components/ContactUs.svelte';
	import { createTypewriteCycle } from '$lib/stores/typewrite-cycle.svelte';
	import { format } from 'date-fns';
	import { nb } from 'date-fns/locale/nb';

	let { data } = $props();

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

	const cycle = createTypewriteCycle(['programmerbar', 'lesesalen', 'hjem', 'beste baren'], 500);
</script>

<div class="py-24 space-y-4">
	<div
		class="bg-background font-medium text-sm flex items-center gap-2 rounded-xl shadow-xl px-4 py-1 border w-fit mx-auto"
	>
		<div
			class={cn('w-3 h-3 rounded-full shadow-lg', {
				'bg-green-500 shadow-green-500': data.status.status === 1,
				'bg-red-500 shadow-red-500 ': data.status.status !== 1
			})}
		/>
		{data.status.message}
	</div>

	<h1 class="text-4xl sm:text-6xl text-center flex flex-col gap-2">
		<span class="font-bold">Velkommen til</span>
		<span class="font-mono w-fit mx-auto px-2 bg-gray-200 py-2">$ {cycle.text}</span>
	</h1>
</div>

<div class="py-10 grid grid-cols-1 md:grid-cols-2 gap-4">
	<div class="bg-background border-black rounded-xl shadow-xl border-2 p-2">
		<h2 class="text-center font-medium text-3xl py-6">Meny</h2>
		<ul class="divide-y-2 divide overflow-hidden">
			{#each data.products.slice(start, end) as { name, producer, price }}
				<li>
					<div class="h-16 px-2 flex items-center justify-between hover:bg-primary">
						<div class="flex flex-col">
							<p class="text-xl">{name}</p>
							<p class="text-gray-700">{producer}</p>
						</div>

						<div>
							<p class="font-medium">{price} kr</p>
						</div>
					</div>
				</li>
			{/each}
		</ul>

		<p class="text-center text-sm font-medium my-2">Side {page + 1} / {TOTAL_PAGES}</p>
	</div>

	<div class="bg-background border-black rounded-xl shadow-xl border-2 p-2">
		<h2 class="text-center font-medium text-3xl py-6">Arrangementer</h2>
		<ul class="divide-y-2 divide overflow-hidden">
			{#each data.events as { title, start, slug }}
				<li>
					<div class="h-16 px-2 flex items-center justify-between hover:bg-primary">
						<a href={`/arrangement/${slug}`} class="text-xl">{title}</a>

						<p>{format(new Date(start), 'EEEE d. MMMM', { locale: nb })}</p>
					</div>
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
