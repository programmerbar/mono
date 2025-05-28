<script lang="ts">
	import EventsTable from '$lib/components/portal/EventTable.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>Arrangementer</title>
</svelte:head>

<div class="mx-auto mx-auto max-w-4xl p-4">
	<EventsTable events={data.events} outdated={data.outdatedEvents} />
</div>
