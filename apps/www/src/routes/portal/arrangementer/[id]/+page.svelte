<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { formatDate, time } from '$lib/date';
	import { capitalize } from '$lib/utils';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.event.name}</title>
</svelte:head>

<Heading>{data.event.name}</Heading>

<section class="mt-8">
	<Heading level={2}>Vakter</Heading>

	<ul class="flex flex-col gap-4 mt-2">
		{#each data.event.shifts as shift}
			<li class="block p-4 rounded-lg border bg-white">
				<p>{capitalize(formatDate(shift.start))}</p>
				<p>{time(shift.start)} - {time(shift.end)}</p>
				<p><b>Ansvarlige</b>: {shift.members.map((member) => member.user.name).join(', ')}</p>
			</li>
		{/each}
	</ul>
</section>

<section class="mt-8">
	<Heading level={2}>Farlig</Heading>

	<form action="?/delete" method="post">
		<Button intent="danger" class="mt-4">Slett arrangement</Button>
	</form>
</section>
