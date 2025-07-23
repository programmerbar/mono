<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Combobox from '$lib/components/ui/Combobox.svelte';
	import { formatDate } from '$lib/date';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let selectedReferrerName = $state('');
	let selectedReferrerId = $state('');
</script>

<svelte:head>
	<title>Hjem — Programmerbar Portal</title>
</svelte:head>

<div class="space-y-10">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<div class="flex flex-col items-center justify-center rounded-lg border bg-white p-4">
			<span class="text-gray-600">Vakter ferdig:</span>
			<span class="text-2xl font-medium">{data.shiftsCompleted}</span>
		</div>
		<div class="flex flex-col items-center justify-center rounded-lg border bg-white p-4">
			<span class="text-gray-600">Gratis øl igjen:</span>
			<span class="text-2xl font-medium">{data.unclaimedBeers}</span>
		</div>
	</div>

	{#if data.canRefer}
		<form method="POST" action="?/refer" use:enhance>
			<div class="rounded-lg border-2 bg-background p-4 shadow-sm">
				<div class="space-y-4">
					<div>
						<p class="mb-2 block text-sm font-medium text-gray-700">
							Skriv namnet på den som referte deg
						</p>
						<div class="flex items-end gap-2">
							<div class="flex-1">
								<Combobox
									name="referrer"
									bind:value={selectedReferrerName}
									onchange={(option) => {
										selectedReferrerId = option?.value || '';
									}}
									options={data.users}
									placeholder="Søk etter navn..."
									class="w-full"
								/>
							</div>
							<Button
								type="submit"
								intent="primary"
								disabled={!selectedReferrerId}
								class="flex shrink-0 items-center gap-2"
							>
								Referrer
							</Button>
						</div>
						<input type="hidden" name="referrerId" value={selectedReferrerId} />
					</div>
				</div>
			</div>
		</form>
	{/if}

	<section>
		<Heading level={2}>Kommende vakter</Heading>
		<ul class="mt-4 flex flex-col gap-4">
			{#each data.upcomingShifts as shift}
				<li>
					<a class="hover:underline" href="/portal/arrangementer/{shift.event?.id}">
						<div class="rounded-lg border border-border bg-white p-2">
							<p>
								{shift.event?.name}: {formatDate(shift.shift.startAt)} - {formatDate(
									shift.shift.endAt
								)}
							</p>
						</div>
					</a>
				</li>
			{:else}
				<li>Ingen vakter</li>
			{/each}
		</ul>
	</section>
</div>
