<script lang="ts">
	import ContactUs from '$lib/components/ContactUs.svelte';
	import { format } from 'date-fns';
	import { nb } from 'date-fns/locale/nb';

	let { data } = $props();
</script>

<p class="py-10 italic text-centeer font-medium text-lg">Nå "Ballmer Peak" med Programmerbar</p>

<div class="py-10 grid grid-cols-1 md:grid-cols-2 gap-4">
	<div>
		<h2 class="text-center font-medium text-3xl py-6">Meny</h2>
		<ul class="border-2 border-black rounded-md divide-y divide-black shadow overflow-hidden">
			{#each data.products as { name, producer, price }}
				<li>
					<div class="flex items-center justify-between p-2 hover:bg-yellow-100">
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

		<!-- TODO animate through all products -->
		<p class="text-center text-sm font-medium mt-2">Side 1 / 3</p>
	</div>

	<div>
		<h2 class="text-center font-medium text-3xl py-6">Arrangementer</h2>
		<ul class="border-2 border-black rounded-md divide-y divide-black shadow overflow-hidden">
			{#each data.events as { title, start }}
				<li>
					<div class="flex items-center justify-between p-2 hover:bg-yellow-100">
						<p class="text-xl">{title}</p>

						<p class="font-medium">{format(new Date(start), 'EEEE d. MMMM', { locale: nb })}</p>
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
