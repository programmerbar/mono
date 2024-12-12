<script lang="ts">
	import { formatDate } from '$lib/date';
	import { capitalize } from '$lib/utils';
	import type { Event } from '$lib/db/schemas';
	import { ArrowRight } from 'lucide-svelte';

	type Props = {
		event: Event;
	};

	let { event }: Props = $props();
</script>

<a class="group" href="/portal/arrangementer/{event.id}">
	<div class="flex items-center justify-between rounded-lg border bg-white p-4">
		<div>
			<h2 class="text-2xl font-medium group-hover:underline">{event.name}</h2>
			<p class="text-sm text-gray-500">{capitalize(formatDate(event.date))}</p>
		</div>

		<ArrowRight
			class="size-0 -translate-x-8 transform text-gray-600 opacity-0 transition-all duration-300 ease-in-out group-hover:size-6 group-hover:translate-x-0 group-hover:opacity-100"
		/>
	</div>
</a>
