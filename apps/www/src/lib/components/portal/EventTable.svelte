<script lang="ts">
	import { formatDate } from '$lib/date';
	import { goto } from '$app/navigation';
	import { SquarePen } from '@lucide/svelte';
	import { getUser } from '$lib/context/user.context';
	import Button from '../ui/Button.svelte';

	type Event = {
		id: string;
		name: string;
		date: Date;
		shifts: {
			id: string;
			startAt: Date;
			endAt: Date;
			members: any[];
		}[];
	};

	const { events, outdated } = $props();

	let search = $state('');
	let activeTab = $state('upcoming');
	let user = getUser();

	function hasActiveShifts(event: Event) {
		const now = new Date();
		return event.shifts.some((shift) => {
			const startTime = new Date(shift.startAt);
			const endTime = new Date(shift.endAt);
			return startTime <= now && now < endTime;
		});
	}

	function hasUpcomingShifts(event: Event) {
		const now = new Date();
		const hasActive = hasActiveShifts(event);
		if (hasActive) return false;

		return event.shifts.some((shift) => {
			const startTime = new Date(shift.startAt);
			return now < startTime;
		});
	}

	function hasActiveOrUpcoming(event: Event) {
		return hasActiveShifts(event) || hasUpcomingShifts(event);
	}

	const upcomingEvents = $derived(
		[...events, ...outdated.filter((event: Event) => hasActiveOrUpcoming(event))].sort((a, b) => {
			if (hasActiveShifts(a)) return -1;
			if (hasActiveShifts(b)) return 1;
			return 0;
		})
	);

	const pastEvnts = $derived(outdated.filter((event: Event) => !hasActiveOrUpcoming(event)));

	const activeEvnts = $derived(activeTab === 'upcoming' ? upcomingEvents : pastEvnts);

	let filteredEvents = $derived(
		activeEvnts.filter((event: Event) => event.name.toLowerCase().includes(search.toLowerCase()))
	);

	function countShifts(event: Event) {
		return event.shifts.length;
	}

	function getEventStatus(event: Event) {
		if (hasActiveShifts(event)) {
			return 'Aktiv';
		} else if (hasUpcomingShifts(event)) {
			return 'Kommende';
		} else {
			return 'Ferdig';
		}
	}

	function getStatusClass(status: string) {
		switch (status) {
			case 'Kommende':
				return 'text-blue-500 font-medium';
			case 'Aktiv':
				return 'text-green-500 font-medium';
			case 'Ferdig':
				return 'text-gray-500 font-medium';
			default:
				return '';
		}
	}
</script>

<div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
	<div class="flex flex-wrap gap-2 bg-white p-2">
		<button
			class={`min-w-[150px] flex-1 cursor-pointer rounded-lg px-6 py-3 font-medium text-gray-500 transition-all duration-200 ease-in-out ${activeTab === 'upcoming' ? 'bg-blue-100 font-semibold text-blue-600' : 'hover:bg-gray-100 hover:text-blue-500'}`}
			onclick={() => (activeTab = 'upcoming')}
		>
			Arrangementer
		</button>
		<button
			class={`min-w-[150px] flex-1 cursor-pointer rounded-lg px-6 py-3 font-medium text-gray-500 transition-all duration-200 ease-in-out ${activeTab === 'past' ? 'bg-blue-100 font-semibold text-blue-600' : 'hover:bg-gray-100 hover:text-blue-500'}`}
			onclick={() => (activeTab = 'past')}
		>
			Tidligere arrangementer
		</button>
	</div>
	<div class="relative w-full px-2">
		<input
			type="text"
			placeholder="Søk etter arrangementer..."
			bind:value={search}
			class="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-32 text-base focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
		/>

		{#if $user?.role === 'board'}
			<div class="absolute right-3 top-1/2 -translate-y-1/2 transform">
				<Button onclick={() => goto(`arrangementer/ny`)}>Nytt arrangement</Button>
			</div>
		{/if}
	</div>

	{#if filteredEvents.length === 0}
		<div class="mx-4 my-4 px-8 py-12 text-center font-medium text-gray-500">
			Ingen {activeTab === 'upcoming' ? 'kommende' : 'tidligere'} arrangementer å vise.
		</div>
	{:else}
		<div class="overflow-x-auto p-2">
			<table class="w-full min-w-[600px]">
				<thead>
					<tr>
						<th class="border-b-2 border-gray-200 p-4 text-left">Arrangement</th>
						<th class="border-b-2 border-gray-200 p-4 text-left">Dato</th>
						<th class="border-b-2 border-gray-200 p-4 text-left">Antall vakter</th>
						<th class="border-b-2 border-gray-200 p-4 text-left">Status</th>
						<th class="border-b-2 border-gray-200 p-4 text-left" aria-label="Handlinger"></th>
					</tr>
				</thead>
				<tbody>
					{#each filteredEvents as event (event.id)}
						{@const status = getEventStatus(event)}
						<tr
							class="cursor-pointer hover:bg-gray-50"
							onclick={() => goto(`arrangementer/${event.id}`)}
						>
							<td
								class="max-w-[200px] overflow-hidden overflow-ellipsis whitespace-nowrap break-words border-b border-gray-100 p-4"
							>
								{event.name}
							</td>
							<td
								class="max-w-[200px] overflow-hidden overflow-ellipsis whitespace-nowrap break-words border-b border-gray-100 p-4"
							>
								{formatDate(event.date)}
							</td>
							<td
								class="max-w-[200px] overflow-hidden overflow-ellipsis whitespace-nowrap break-words border-b border-gray-100 p-4"
							>
								{countShifts(event)}
							</td>
							<td
								class={`max-w-[200px] overflow-hidden overflow-ellipsis whitespace-nowrap break-words border-b border-gray-100 p-4 ${getStatusClass(status)}`}
							>
								{status}
							</td>
							<td class="border-b border-gray-100 p-4">
								{#if $user?.role === 'board'}
									<a
										href="arrangementer/{event.id}/edit"
										class="inline-flex text-gray-400 opacity-70 transition-all duration-200 ease-in-out hover:text-blue-500 hover:opacity-100"
										aria-label="Rediger arrangement"
									>
										<SquarePen size={18} />
									</a>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
