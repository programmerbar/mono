<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { isFuture, isSameDay } from 'date-fns';
	import { formatDate, time } from '$lib/utils/date';
	import { capitalize } from '$lib/utils/string.js';

	let { data } = $props();
	let { shifts, user } = data;

	let shiftsByDay = shifts
		.filter((shift) => isFuture(shift.end))
		.reduce(
			(acc, shift) => {
				let key = capitalize(formatDate(shift.start));

				if (!acc[key]) {
					acc[key] = [];
				}

				acc[key].push(shift);

				return acc;
			},
			{} as Record<string, Array<(typeof shifts)[number]>>
		);
</script>

<SEO title="Ståplan" />

<main class="max-w-screen-md space-y-8">
	<h1 class="text-2xl font-medium">Kommende ståplan</h1>

	{#if user.type === 'admin'}
		<p>
			<a href="/portal/staplan/ny" class="text-sm text-blue-500 hover:underline"
				>Opprett ny ståplan</a
			>
		</p>
	{/if}

	<div>
		{#each Object.entries(shiftsByDay) as [day, shifts]}
			<div class="py-4">
				<h2 class="text-xl font-medium mb-4">{day}</h2>

				<ul class="flex flex-col divide-y">
					{#each shifts as shift}
						<li class="py-4">
							<div class="flex items-center gap-2">
								<p class="font-medium">
									{isSameDay(shift.start, shift.end)
										? `${time(shift.start)} - ${time(shift.end)}`
										: `${time(shift.start)} - ${time(shift.end)}`}:
								</p>
								<p>{shift.members.map(({ user }) => user.name).join(', ')}</p>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</main>
