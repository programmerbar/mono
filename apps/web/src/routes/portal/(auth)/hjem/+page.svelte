<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { formatDate, time } from '$lib/utils/date';
	import { isSameDay } from 'date-fns';

	let { data } = $props();
	let { user, shifts } = data;

	let upcomingShifts = shifts.filter(({ shift }) => new Date(shift.end) > new Date());
	let pastShifts = shifts.filter(({ shift }) => new Date(shift.end) < new Date());
</script>

<SEO title="Hjem" />

<div class="flex flex-col gap-4 max-w-screen-md w-full">
	<h1 class="text-2xl font-medium">Velkommen tilbake, {user.name}</h1>

	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<div class="p-4 rounded-lg border">
			<p class="text-lg">Antall vakter</p>
			<p class="text-2xl font-bold">{pastShifts.length}</p>
		</div>

		<div class="p-4 rounded-lg border">
			<p class="text-lg">Antall vakter denne måneden</p>
			<p class="text-2xl font-bold">
				{shifts.filter(({ shift }) => new Date(shift.start).getMonth() === new Date().getMonth())
					.length}
			</p>
		</div>
	</div>

	<div class="space-y-4">
		<h2 class="text-xl font-medium">Dine vakter</h2>

		{#if upcomingShifts.length > 0}
			<h3 class="text-lg font-medium">Kommende vakter</h3>
			<ul class="flex flex-col gap-4">
				{#each upcomingShifts as { shift }}
					{@const text = isSameDay(shift.start, shift.end)
						? `${formatDate(shift.start)} kl. ${time(shift.start)} - ${time(shift.end)}`
						: `${formatDate(shift.start)} kl. ${time(shift.start)} - ${formatDate(shift.end)} kl. ${time(shift.end)}`}
					<li class="p-4 rounded-lg border">
						<div>
							<p>{text}</p>
							<p>{shift.members.map(({ user }) => user.name).join(', ')}</p>
						</div>
					</li>
				{/each}
			</ul>
		{/if}

		{#if pastShifts.length > 0}
			<h3 class="text-lg font-medium">Tidligere vakter</h3>
			<ul class="flex flex-col gap-4">
				{#each pastShifts as { shift }}
					<li class="p-4 rounded-lg border">
						<div>
							<p>{formatDate(shift.start)}</p>
							<p>{shift.members.map(({ user }) => user.name).join(', ')}</p>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
