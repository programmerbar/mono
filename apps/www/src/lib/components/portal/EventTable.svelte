<script lang="ts">
	import { formatDate } from '$lib/date';
	import { goto } from '$app/navigation';
	import { SquarePen } from '@lucide/svelte';
	import { getUser } from '$lib/context/user.context';

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
				return 'text-blue-500';
			case 'Aktiv':
				return 'text-green-500';
			case 'Ferdig':
				return 'text-gray-500';
			default:
				return '';
		}
	}
</script>

<div class="event-table">
	<div class="tabs">
		<button
			class={activeTab === 'upcoming' ? 'active' : ''}
			onclick={() => (activeTab = 'upcoming')}
		>
			Arrangementer
		</button>
		<button class={activeTab === 'past' ? 'active' : ''} onclick={() => (activeTab = 'past')}>
			Tidligere arrangementer
		</button>
	</div>
	<div class="search-container">
		<input
			type="text"
			placeholder="Søk etter arrangementer..."
			bind:value={search}
			class="search-input"
		/>

		{#if filteredEvents.length === 0}
			<div class="empty-state">
				Ingen {activeTab === 'upcoming' ? 'kommende' : 'tidligere'} arrangementer å vise.
			</div>
		{:else}
			<div class="table-container">
				<table>
					<thead>
						<tr>
							<th>Arrangement</th>
							<th>Dato</th>
							<th>Antall vakter</th>
							<th>Status</th>
							<th aria-label="Handlinger"></th>
						</tr>
					</thead>
					<tbody>
						{#each filteredEvents as event (event.id)}
							{@const status = getEventStatus(event)}
							<tr class="event.row" onclick={() => goto(`arrangementer/${event.id}`)}>
								<td>{event.name}</td>
								<td>{formatDate(event.date)}</td>
								<td>{countShifts(event)}</td>
								<td class={getStatusClass(status)}>{status}</td>
								<td class="action-column">
									<!-- Dette kommer når eg har edit side -->
									<!--         {#if $user?.role === 'board'} -->
									<!-- <a -->
									<!-- 	href="arrangementer/{event.id}/edit" -->
									<!-- 	class="edit-icon" -->
									<!-- 	aria-label="Rediger arrangement" -->
									<!-- > -->
									<!-- 	<SquarePen size={18} /> -->
									<!-- </a> -->
									<!-- {/if} -->
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<style>
	.event-table {
		border-radius: 16px;
		overflow: hidden;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
		background-color: var(--background-color);
		border: 1px solid #f0f0f0;
	}

	.tabs {
		display: flex;
		background-color: backround-color;
		padding: 0.5rem;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tabs button {
		padding: 0.75rem 1.5rem;
		font-weight: 500;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		color: #6b7280;
		flex: 1; /* Flexible width */
		min-width: 150px;
	}

	.tabs button:hover {
		background-color: #f3f4f6;
		color: #3b82f6;
	}

	.tabs button.active {
		background-color: #eff6ff;
		color: #2563eb;
		font-weight: 600;
	}

	.table-container {
		overflow-x: auto;
		padding: 0.5rem;
	}

	table {
		width: 100%;
		min-width: 600px;
	}

	th,
	td {
		padding: 1rem;
		text-align: left;
	}

	@media (max-width: 768px) {
		th,
		td {
			padding: 0.75rem 0.5rem;
		}
	}

	th {
		border-bottom: 2px solid #e5e7eb;
	}

	td {
		border-bottom: 1px solid #f3f4f6;
		word-break: break-word;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 200px;
	}

	tr:last-child td {
		border-bottom: none;
	}

	tr:hover td {
		background-color: #f9fafb;
	}

	.empty-state {
		padding: 3rem 2rem;
		text-align: center;
		color: #6b7280;
		font-weight: 500;
		margin: 1rem;
	}

	.text-blue-500 {
		color: #3b82f6;
		font-weight: 500;
	}

	.text-green-500 {
		color: #10b981;
		font-weight: 500;
	}

	.text-gray-500 {
		color: #6b7280;
		font-weight: 500;
	}

	.edit-icon {
		display: inline-flex;
		opacity: 0.7;
		transition: all 0.2s ease;
		color: #9ca3af;
	}

	.edit-icon:hover {
		color: #3b82f6;
		opacity: 1;
	}
	@media (max-width: 480px) {
		.event-table {
			border-radius: 8px;
		}

		.empty-state {
			padding: 2rem 1rem;
		}
	}
	.search-container {
		padding: 1rem;
		background-color: background-color;
		border-bottom: 1px solid #f0f0f0;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
		background-color: #f9fafb;
		font-size: 1rem;
		transition: all 0.2s ease;
	}

	.search-input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
		background-color: background-color;
	}

	.search-input::placeholder {
		color: #9ca3af;
	}
</style>
