<script lang="ts">
	import { formatDate } from '$lib/date';
	import type { Event } from '$lib/db/schema';

	type Props = {
		event: Event;
	};

	let { event }: Props = $props();
</script>

<div class="p-4 border rounded-lg bg-background">
	<h2 class="text-2xl font-medium">{event.name}</h2>
	<p class="text-gray-500 text-sm">{formatDate(event.date)}</p>
</div>
