<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import { formatDate } from '$lib/date';

	let { data } = $props();
</script>

<svelte:head>
	<title>Hjem — Programmerbar Portal</title>
</svelte:head>

<div class="space-y-10">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="rounded-lg border p-4 bg-white flex flex-col items-center justify-center">
			<span class="text-gray-600">Vakter ferdig:</span>
			<span class="text-2xl font-medium">{data.shiftsCompleted}</span>
		</div>
		<div class="rounded-lg border p-4 bg-white flex flex-col items-center justify-center">
			<span class="text-gray-600">Gratis øl igjen:</span>
			<span class="text-2xl font-medium">{data.unclaimedBeers}</span>
		</div>
	</div>

	<section>
		<Heading level={2}>Kommende vakter</Heading>

		<ul class="mt-4">
			{#each data.upcomingShifts as shift}
				<li>
					<div class="p-2 rounded-lg border border-border bg-white">
						{shift.event?.name}: {formatDate(shift.shift.start)} - {formatDate(shift.shift.end)}
					</div>
				</li>
			{:else}
				<li>Ingen vakter</li>
			{/each}
		</ul>
	</section>
</div>
