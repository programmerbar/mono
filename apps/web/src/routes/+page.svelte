<script lang="ts">
	import ContactUs from '$lib/components/ContactUs.svelte';
	import { format } from 'date-fns';
	import { nb } from 'date-fns/locale/nb';

	let { data } = $props();
</script>

<p class="py-10 italic text-centeer font-medium text-lg">Nå "Ballmer Peak" med Programmerbar</p>

<div class="py-10 grid grid-cols-2 gap-4">
	<div class="border-2 border-black rounded-md divide-y divide-black shadow">
		<h2 class="text-center font-medium text-2xl py-6">Meny</h2>
		<ul class="divide-y divide-black">
			{#each data.products as { name, producer, price }}
				<li>
					<div class="flex items-center justify-between p-2">
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
	</div>

	<div class="border-2 border-black rounded-md divide-y divide-black shadow">
		<h2 class="text-center font-medium text-2xl py-6">Åpningstider</h2>
		<ul class="divide-y divide-black">
			{#each data.events as { title, start }}
				<li>
					<div class="flex items-center justify-between p-2">
						<p class="text-xl">{title}</p>

						<p class="font-medium">{format(new Date(start), 'EEEE d. MMMM', { locale: nb })}</p>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>

<ContactUs />
