<script lang="ts">
	import { formatDate } from '$lib/date';
	import { SquarePen } from '@lucide/svelte';
	import { getUser } from '$lib/context/user.context';
	import Button from '../ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import type { Event, Shift } from '$lib/db/schemas';
	import { resolve } from '$app/paths';

	type EventWithShifts = Event & {
		shifts: Array<Shift>;
	};

	type Props = {
		events: Array<EventWithShifts>;
		outdated: Array<EventWithShifts>;
	};

	const { events, outdated }: Props = $props();

	let search = $state('');
	let activeTab = $state('upcoming');
	let user = getUser();

	function hasActiveShifts(event: EventWithShifts) {
		const now = new Date();
		return event.shifts.some((shift) => {
			const startTime = new Date(shift.startAt);
			const endTime = new Date(shift.endAt);
			return startTime <= now && now < endTime;
		});
	}

	function hasUpcomingShifts(event: EventWithShifts) {
		const now = new Date();
		const hasActive = hasActiveShifts(event);
		if (hasActive) return false;

		return event.shifts.some((shift) => {
			const startTime = new Date(shift.startAt);
			return now < startTime;
		});
	}

	function hasActiveOrUpcoming(event: EventWithShifts) {
		return hasActiveShifts(event) || hasUpcomingShifts(event);
	}

	const upcomingEvents = $derived(
		[...events, ...outdated.filter((event) => hasActiveOrUpcoming(event))].sort((a, b) => {
			if (hasActiveShifts(a)) return -1;
			if (hasActiveShifts(b)) return 1;
			return 0;
		})
	);

	const pastEvnts = $derived(outdated.filter((event) => !hasActiveOrUpcoming(event)));

	const activeEvnts = $derived(activeTab === 'upcoming' ? upcomingEvents : pastEvnts);

	let filteredEvents = $derived(
		activeEvnts.filter((event) => event.name.toLowerCase().includes(search.toLowerCase()))
	);

	function countShifts(event: EventWithShifts) {
		return event.shifts.length;
	}

	function getEventStatus(event: EventWithShifts) {
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

	let isMobile = $state(false);

	const handleResize = () => {
		isMobile = window.innerWidth < 568;
	};

	$effect(() => {
		handleResize();
	});
</script>

<svelte:window onresize={handleResize} />
<div class="border-gray bg-background overflow-hidden rounded-2xl border-2 shadow-lg">
	<div class="flex flex-wrap gap-2 border-b-2 bg-gray-200 p-2">
		<button
			class="min-w-[200px] flex-1 cursor-pointer rounded-lg px-6 py-3 font-medium text-gray-500 transition-all duration-200 ease-in-out {activeTab ===
			'upcoming'
				? 'bg-gray-300 font-semibold'
				: 'hover:bg-gray-250 hover:text-blue-500'}"
			onclick={() => (activeTab = 'upcoming')}
		>
			Arrangementer
		</button>

		<button
			class="min-w-[200px] flex-1 cursor-pointer rounded-lg px-6 py-3 font-medium text-gray-500 transition-all duration-200 ease-in-out {activeTab ===
			'past'
				? 'bg-gray-300 font-semibold'
				: 'hover:bg-gray-250 hover:text-blue-500'}"
			onclick={() => (activeTab = 'past')}
		>
			Tidligere arrangementer
		</button>
	</div>

	<div class="flex {isMobile ? 'flex-col' : 'flex-row items-center'} gap-1 p-2">
		{#if $user?.role === 'board'}
			<a
				href={resolve('/portal/arrangementer/ny')}
				class={isMobile ? 'order-first w-full' : 'order-last'}
			>
				<Button type="button" intent="primary" class={isMobile ? 'w-full' : ''}>
					Nytt arrangement
				</Button>
			</a>
		{/if}

		<Input
			type="search"
			placeholder="Søk etter arrangementer..."
			bind:value={search}
			class="w-full flex-1 border-2
      {isMobile || !($user?.role === 'board') ? 'pr-4' : 'pr-32'}"
		/>
	</div>

	{#if filteredEvents.length === 0}
		<div class="mx-4 my-4 px-8 py-12 text-center font-medium text-gray-500">
			Ingen {activeTab === 'upcoming' ? 'kommende' : 'tidligere'} arrangementer å vise.
		</div>
	{:else}
		<div class="overflow-x-auto p-2">
			<table class="w-full table-fixed">
				{#if isMobile}
					<colgroup>
						<col class="w-[60%]" />
						<col class="w-[40%]" />
					</colgroup>
				{:else}
					<colgroup>
						<col class="w-[35%]" />
						<col class="w-[20%]" />
						<col class="w-[20%]" />
						<col class="w-[15%]" />
					</colgroup>
				{/if}
				<thead>
					<tr class="border-b-2 border-gray-200">
						<th class="p-4 text-left">Arrangement</th>
						{#if isMobile}
							<th class="p-4 text-left">Status</th>
						{:else}
							<th class="p-4 text-left">Dato</th>
							<th class="p-4 text-left">Antall vakter</th>
							<th class="p-4 text-left">Status</th>
							<th class="p-4 text-left" aria-label="Handlinger"></th>
						{/if}
					</tr>
				</thead>
				<tbody class="border-b border-gray-100 break-words whitespace-nowrap">
					{#each filteredEvents as event (event.id)}
						{@const status = getEventStatus(event)}
						<tr class="hover:bg-gray-50">
							<td class="overflow-hidden p-4 overflow-ellipsis">
								<a
									href={resolve('/(portal)/portal/arrangementer/[id]', { id: event.id })}
									class="text-blue-600 hover:text-blue-800 hover:underline"
								>
									{event.name}
								</a>
							</td>
							{#if isMobile}
								<td class="overflow-hidden p-4 overflow-ellipsis {getStatusClass(status)}">
									{status}
								</td>
							{:else}
								<td class="overflow-hidden p-4 overflow-ellipsis">
									{formatDate(event.date)}
								</td>
								<td class="overflow-hidden p-4 overflow-ellipsis">
									{countShifts(event)}
								</td>
								<td class="overflow-hidden p-4 overflow-ellipsis {getStatusClass(status)}">
									{status}
								</td>
								{#if !isMobile}
									<td class="p-4">
										{#if $user?.role === 'board'}
											<a
												href={resolve('/(portal)/portal/arrangementer/[id]/rediger', {
													id: event.id
												})}
												class="relative z-10 inline-flex text-gray-400 opacity-70 transition-all duration-200 ease-in-out hover:text-blue-500 hover:opacity-100"
												aria-label="Rediger arrangement"
											>
												<SquarePen size={18} />
											</a>
										{/if}
									</td>
								{/if}
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
