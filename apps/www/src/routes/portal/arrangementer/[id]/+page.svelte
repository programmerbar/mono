<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { formatDate, time } from '$lib/date';
	import { capitalize } from '$lib/utils';
	import { enhance } from '$app/forms';
	import { getAuthContext } from '$lib/context/user.context.js';

	let { data } = $props();

	const auth = getAuthContext();
</script>

<svelte:head>
	<title>{data.event.name}</title>
</svelte:head>

<Heading>{data.event.name}</Heading>

<section class="mt-8">
	<Heading level={2}>Vakter</Heading>

	<ul class="flex flex-col gap-4 mt-2">
		{#each data.event.shifts as shift}
			{@const isInShift = shift.members.some((member) => member.userId === auth.user?.id)}
			<li class="block p-4 rounded-lg border bg-white">
				<p>{capitalize(formatDate(shift.start))}</p>
				<p>{time(shift.start)} - {time(shift.end)}</p>
				<p><b>Ansvarlige</b>: {shift.members.map((member) => member.user.name).join(', ')}</p>

				{#if !isInShift}
					<form class="mt-4" action="?/join" method="post" use:enhance>
						<input type="hidden" name="shiftId" value={shift.id} />
						<button class="text-blue-500 hover:underline">Bli med på vakten &rarr;</button>
					</form>
				{:else}
					<form class="mt-4" action="?/leave" method="post" use:enhance>
						<input type="hidden" name="shiftId" value={shift.id} />
						<button class="text-red-500 hover:underline">Forlat vakten &rarr;</button>
					</form>
				{/if}
			</li>
		{/each}
	</ul>
</section>

<section class="mt-8">
	<Heading level={2}>Farlig</Heading>

	<form action="?/delete" method="post" use:enhance>
		<Button intent="danger" class="mt-4">Slett arrangement</Button>
	</form>
</section>
