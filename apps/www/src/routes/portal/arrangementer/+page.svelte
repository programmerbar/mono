<script lang="ts">
	import EventsTable from '$lib/components/portal/EventTable.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>Arrangementer</title>
</svelte:head>

<div class="container">
	<EventsTable events={data.events} outdated={data.outdatedEvents} />
</div>

<style>
	.container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
	}
</style>
