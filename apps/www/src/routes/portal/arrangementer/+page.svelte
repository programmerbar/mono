<script lang="ts">
	import EventPreview from '$lib/components/portal/EventPreview.svelte';
	import Heading from '$lib/components/ui/Heading.svelte';

	let { data } = $props();
</script>

<Heading class="mb-4">Arrangementer</Heading>

<a href="/portal/arrangementer/ny" class="hover:underline text-blue-500">Nytt arrangement</a>

{#each data.events as event}
	<EventPreview {event} />
{:else}
	<p>Ingen arrangementer</p>
{/each}
