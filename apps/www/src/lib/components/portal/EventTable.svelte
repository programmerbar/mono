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

	const upcomingEvents = $derived([
		...events,
		...outdated.filter((event: Event) => hasActiveOrUpcoming(event))
	]);

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

<div class="rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-100">
	<div class="flex bg-white p-2 gap-2 flex-wrap">
		<button
			class={`py-3 px-6 font-medium rounded-lg cursor-pointer transition-all duration-200 ease-in-out text-gray-500 flex-1 min-w-[150px] ${activeTab === 'upcoming' ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-gray-100 hover:text-blue-500'}`}
			onclick={() => (activeTab = 'upcoming')}
		>
			Arrangementer
		</button>
		<button 
			class={`py-3 px-6 font-medium rounded-lg cursor-pointer transition-all duration-200 ease-in-out text-gray-500 flex-1 min-w-[150px] ${activeTab === 'past' ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-gray-100 hover:text-blue-500'}`}
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
			class="w-full py-3 pr-32 pl-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"

		/>

		{#if $user?.role === 'board'}
		<div class="absolute top-1/2 right-3 transform -translate-y-1/2">
			<Button onclick={() => goto(`arrangementer/ny`)}>Nytt arrangement</Button>
		</div>
		{/if}
	</div> 
	
	{#if filteredEvents.length === 0}
		<div class="py-12 px-8 text-center text-gray-500 font-medium mx-4 my-4">
			Ingen {activeTab === 'upcoming' ? 'kommende' : 'tidligere'} arrangementer å vise.
		</div>
	{:else}
		<div class="overflow-x-auto p-2">
			<table class="w-full min-w-[600px]">
				<thead>
					<tr>
						<th class="p-4 text-left border-b-2 border-gray-200">Arrangement</th>
						<th class="p-4 text-left border-b-2 border-gray-200">Dato</th>
						<th class="p-4 text-left border-b-2 border-gray-200">Antall vakter</th>
						<th class="p-4 text-left border-b-2 border-gray-200">Status</th>
						<th class="p-4 text-left border-b-2 border-gray-200" aria-label="Handlinger"></th>
					</tr>
				</thead>
				<tbody>
					{#each filteredEvents as event (event.id)}
						{@const status = getEventStatus(event)}
						<tr class="cursor-pointer hover:bg-gray-50" onclick={() => goto(`arrangementer/${event.id}`)}>
							<td class="p-4 border-b border-gray-100 break-words whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[200px]">
								{event.name}
							</td>
							<td class="p-4 border-b border-gray-100 break-words whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[200px]">
								{formatDate(event.date)}
							</td>
							<td class="p-4 border-b border-gray-100 break-words whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[200px]">
								{countShifts(event)}
							</td>
							<td class={`p-4 border-b border-gray-100 break-words whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[200px] ${getStatusClass(status)}`}>
								{status}
							</td>
							<td class="p-4 border-b border-gray-100">
								{#if $user?.role === 'board'}
								<a
									href="arrangementer/{event.id}/edit"
									class="inline-flex opacity-70 transition-all duration-200 ease-in-out text-gray-400 hover:text-blue-500 hover:opacity-100"
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
