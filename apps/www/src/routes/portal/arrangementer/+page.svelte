<script lang="ts">
	import EventPreview from '$lib/components/portal/EventPreview.svelte';
	import Heading from '$lib/components/ui/Heading.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Arrangementer</title>
</svelte:head>

<Heading>Arrangementer</Heading>

<p class="mt-4">
	<a href="/portal/arrangementer/ny" class="hover:underline text-blue-500">Nytt arrangement</a>
</p>

<ul class="flex flex-col gap-4 mt-4">
	{#each data.events as event}
		<li>
			<EventPreview {event} />
		</li>
	{:else}
		<p>Ingen arrangementer</p>
	{/each}
</ul>
