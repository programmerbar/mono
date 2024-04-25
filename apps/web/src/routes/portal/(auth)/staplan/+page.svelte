<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { isSameDay } from 'date-fns';
	import { formatDate, time } from '$lib/utils/date';

	let { data } = $props();
	let { shifts, user } = data;
</script>

<SEO title="Ståplan" />

<main class="max-w-screen-md space-y-8">
	<h1 class="text-2xl font-medium">Ståplan</h1>

	{#if user.type === 'admin'}
		<a href="/portal/staplan/ny" class="text-sm text-primary-500 hover:underline"
			>Opprett ny ståplan</a
		>
	{/if}

	<ul class="flex flex-col gap-4">
		{#each shifts as shift}
			{@const title = isSameDay(shift.start, shift.end)
				? `${formatDate(shift.start)} ${time(shift.start)} til ${time(shift.end)}`
				: `${formatDate(shift.start)} ${time(shift.start)} til ${formatDate(shift.end)} ${time(shift.end)}`}
			{@const users = shift.members.map((member) => member.user.name).join(', ')}
			<li class="p-4 rounded-lg border">
				<div>
					<p>{title}</p>
					<p>{users}</p>
				</div>
			</li>
		{/each}
	</ul>
</main>
