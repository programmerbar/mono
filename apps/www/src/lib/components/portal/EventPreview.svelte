<script lang="ts">
	import { formatDate } from '$lib/date';
	import { capitalize } from '$lib/utils';
	import type { Event } from '$lib/db/schema';
	import { ArrowRight } from 'lucide-svelte';

	type Props = {
		event: Event;
	};

	let { event }: Props = $props();
</script>

<a class="group" href="/portal/arrangementer/{event.id}">
	<div class="p-4 flex items-center justify-between border rounded-lg bg-white">
		<div>
			<h2 class="group-hover:underline text-2xl font-medium">{event.name}</h2>
			<p class="text-gray-500 text-sm">{capitalize(formatDate(event.date))}</p>
		</div>

		<ArrowRight
			class="transition-all size-0 group-hover:size-6 duration-300 ease-in-out transform -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-gray-600"
		/>
	</div>
</a>
