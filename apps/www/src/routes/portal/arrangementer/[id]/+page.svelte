<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import { subHours } from 'date-fns';
	import { formatDate, time } from '$lib/date';
	import { capitalize } from '$lib/utils';
	import { enhance } from '$app/forms';
	import { getUser } from '$lib/context/user.context.js';

	let { data } = $props();

	let user = getUser();
</script>

<svelte:head>
	<title>{data.event.name}</title>
</svelte:head>

<Heading>{data.event.name}</Heading>

<section class="mt-8">
	<Heading level={2}>Vakter</Heading>

	<ul class="mt-2 flex flex-col gap-4">
		{#each data.event.shifts as shift}
			{@const isInShift = shift.members.some((member) => member.userId === $user?.id)}
			<li class="block rounded-lg border bg-white p-4">
				<p>{capitalize(formatDate(shift.startAt))}</p>
				<p>{time(subHours(shift.startAt, 2))} - {time(subHours(shift.endAt, 2))}</p>
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

