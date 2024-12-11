<script lang="ts">
	import EventPreview from '$lib/components/portal/EventPreview.svelte';
	import Heading from '$lib/components/ui/Heading.svelte';
	import { getAuthContext } from '$lib/context/user.context.js';

	let { data } = $props();

	let auth = getAuthContext();
</script>

<svelte:head>
	<title>Arrangementer</title>
</svelte:head>

<Heading>Arrangementer</Heading>
{#if auth.user?.role == 'board'}
	<p class="mt-4">
		<a href="/portal/arrangementer/ny" class="text-blue-500 hover:underline">Nytt arrangement</a>
	</p>
{/if}

<ul class="mt-4 flex flex-col gap-4">
	{#each data.events as event}
		<li>
			<EventPreview {event} />
		</li>
	{:else}
		<p>Ingen arrangementer</p>
	{/each}
</ul>
