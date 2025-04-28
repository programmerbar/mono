<script lang="ts">
	import EventPreview from '$lib/components/portal/EventPreview.svelte';
	import Heading from '$lib/components/ui/Heading.svelte';
	import { getUser } from '$lib/context/user.context.js';
	let { data } = $props();
	let user = getUser();
  let showOutdatedEvents = $state(false);
  
  function toggleOutdatedEvents() {
    showOutdatedEvents = !showOutdatedEvents;
  }

</script>

<svelte:head>
	<title>Arrangementer</title>
</svelte:head>

<Heading>Arrangementer</Heading>
{#if $user?.role == 'board'}
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

<div class="mt-8">
  <button 
    class="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-left focus:outline-none"
    onclick={toggleOutdatedEvents}
    aria-expanded={showOutdatedEvents}
  >
    <h3 class="text-lg font-medium m0">
    {showOutdatedEvents ? 'Skjul tidligere arrangementer' : 'Vis tidligere arrangementer'}
     </h3> 
  </button>
</div>

{#if showOutdatedEvents}
  <div class="mt-4">
    <ul class="mt-4 flex flex-col gap-4">
      {#each data.outdatedEvents as event}
        <li>
          <EventPreview {event} />
        </li>
      {:else}
        <p>Ingen tidligere arrangementer</p>
      {/each}
    </ul>
  </div>
{/if}
