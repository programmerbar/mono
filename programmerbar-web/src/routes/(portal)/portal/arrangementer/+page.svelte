<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Pill from '$lib/components/ui/Pill.svelte';
	import { formatDate } from '$lib/utils/date';
	import { SquarePen, Calendar, Users } from '@lucide/svelte';
	import { getUser } from '$lib/states/user';
	import { resolve } from '$app/paths';
	import type { Event, Shift } from '$lib/server/db/schemas';

	type EventWithShifts = Event & {
		shifts: Array<Shift>;
	};

	const { data } = $props();
	let user = getUser();
	let search = $state('');
	let activeTab = $state('upcoming');

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
		[...data.events, ...data.outdatedEvents.filter((event) => hasActiveOrUpcoming(event))].sort(
			(a, b) => {
				if (hasActiveShifts(a)) return -1;
				if (hasActiveShifts(b)) return 1;
				return 0;
			}
		)
	);

	const pastEvents = $derived(data.outdatedEvents.filter((event) => !hasActiveOrUpcoming(event)));

	const activeEvents = $derived(activeTab === 'upcoming' ? upcomingEvents : pastEvents);

	let filteredEvents = $derived(
		activeEvents.filter((event) => event.name.toLowerCase().includes(search.toLowerCase()))
	);

	function getEventStatus(event: EventWithShifts) {
		if (hasActiveShifts(event)) {
			return { text: 'Aktiv', variant: 'green' as const };
		} else if (hasUpcomingShifts(event)) {
			return { text: 'Kommende', variant: 'blue' as const };
		} else {
			return { text: 'Ferdig', variant: 'gray' as const };
		}
	}
</script>

<svelte:head>
	<title>Arrangementer</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<Heading>Arrangementer</Heading>
		{#if $user?.role === 'board'}
			<a href={resolve('/portal/arrangementer/ny')}>
				<Button intent="primary">Nytt arrangement</Button>
			</a>
		{/if}
	</div>

	<!-- Tabs and Search -->
	<div class="bg-portal-card border-portal-border overflow-hidden rounded-lg border">
		<!-- Tab Navigation -->
		<div class="border-portal-border flex border-b">
			<button
				class="flex-1 border-b-2 px-6 py-4 text-sm font-medium transition-colors {activeTab ===
				'upcoming'
					? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
					: 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
				onclick={() => (activeTab = 'upcoming')}
			>
				Arrangementer ({upcomingEvents.length})
			</button>
			<button
				class="flex-1 border-b-2 px-6 py-4 text-sm font-medium transition-colors {activeTab ===
				'past'
					? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
					: 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
				onclick={() => (activeTab = 'past')}
			>
				Tidligere arrangementer ({pastEvents.length})
			</button>
		</div>

		<!-- Search -->
		<div class="p-4">
			<Input
				type="search"
				placeholder="Søk etter arrangementer..."
				bind:value={search}
				class="w-full border"
			/>
		</div>

		<!-- Events List -->
		<div class="divide-portal-border divide-y overflow-hidden">
			{#if filteredEvents.length === 0}
				<div class="px-6 py-12 text-center">
					<Calendar class="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
					<p class="text-lg font-medium text-gray-500 dark:text-gray-400">
						Ingen {activeTab === 'upcoming' ? 'kommende' : 'tidligere'} arrangementer
					</p>
					<p class="mt-1 text-sm text-gray-400 dark:text-gray-500">
						{activeTab === 'upcoming'
							? 'Nye arrangementer vil vises her når de opprettes.'
							: 'Tidligere arrangementer vil vises her.'}
					</p>
				</div>
			{:else}
				{#each filteredEvents as event (event.id)}
					{@const status = getEventStatus(event)}
					<div class="bg-portal-card hover:bg-portal-hover p-4 transition-colors">
						<div class="flex items-start justify-between">
							<div class="min-w-0 flex-1">
								<div class="mb-2 flex items-center gap-3">
									<a
										href={resolve('/(portal)/portal/arrangementer/[id]', { id: event.id })}
										class="text-lg font-medium text-gray-900 transition-colors hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
									>
										{event.name}
									</a>
									<Pill variant={status.variant}>
										{status.text}
									</Pill>
								</div>

								<div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
									<div class="flex items-center gap-1">
										<Calendar class="h-4 w-4" />
										<span>{formatDate(event.date)}</span>
									</div>
									<div class="flex items-center gap-1">
										<Users class="h-4 w-4" />
										<span>{event.shifts.length} vakter</span>
									</div>
								</div>
							</div>

							{#if $user?.role === 'board'}
								<a
									href={resolve('/(portal)/portal/arrangementer/[id]/rediger', { id: event.id })}
									class="border-portal-border dark:hover:bg-portal-hover flex h-8 w-8 items-center justify-center rounded-lg border text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
									aria-label="Rediger arrangement"
								>
									<SquarePen class="h-4 w-4" />
								</a>
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
