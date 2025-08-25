<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import ButtonLink from '$lib/components/ui/ButtonLink.svelte';
	import Pill from '$lib/components/ui/Pill.svelte';
	import TrainingChecklist from '$lib/components/portal/Training.svelte';
	import type { User } from '$lib/db/schemas';
	import { initials, mailto } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { ArrowLeft, UserCog, Edit3 } from '@lucide/svelte';
	import Input from '$lib/components/ui/Input.svelte';

	let { data } = $props();
	let user = $state(data.user as User);

	let showDeleteConfirm = $state(false);
	let showAddBeers = $state(false);
	let showTrainingChecklist = $state(false);
	let additionalBeers = $state(0);
	let deleteConfirmName = $state('');

	let userHasCompletedTraining = $state(data.user.isTrained || false);

	let toastMessage = $state('');

	function showToast(message: string) {
		toastMessage = message;
		setTimeout(() => {
			toastMessage = '';
		}, 3000);
	}

	function onTrainingSave(data: { completionStatus: { isComplete: boolean } }) {
		if (data.completionStatus.isComplete) {
			userHasCompletedTraining = true;
			user.isTrained = true;
			showTrainingChecklist = false;
			showToast(`${user.name} har fullført opplæringen! ✅`);
		}
	}
</script>

<svelte:head>
	<title>Admin - {user.name}</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header with back button -->
	<div class="flex items-center gap-4">
		<ButtonLink href="/portal/admin" intent="outline" size="square">
			<ArrowLeft class="h-5 w-5" />
		</ButtonLink>
		<div>
			<Heading>Brukerdetaljer</Heading>
			<p class="mt-1 text-gray-600">Vis og administrer {user.name}s profil</p>
		</div>
	</div>

	<!-- User overview -->
	<div class="rounded-lg border bg-white p-4 sm:p-6">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
					<span class="text-2xl font-semibold text-blue-600">
						{initials(data.user.name)}
					</span>
				</div>
				<div class="min-w-0 flex-1">
					<Heading class="mb-1 truncate">{user.name}</Heading>
					<div class="flex items-center gap-3">
						<Pill variant={user.role === 'board' ? 'purple' : 'blue'}>
							{user.role === 'board' ? 'Styret' : 'Frivillig'}
						</Pill>
					</div>
				</div>
			</div>
			<ButtonLink
				href="/portal/admin/bruker/{user.id}/rediger"
				intent="primary"
				class="flex items-center gap-2"
			>
				<Edit3 class="h-4 w-4" />
				Rediger
			</ButtonLink>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<div class="space-y-6 lg:col-span-2">
			<div class="rounded-lg border bg-white">
				<div class="border-b px-6 py-4">
					<div class="flex items-center gap-2">
						<UserCog class="h-5 w-5 text-gray-600" />
						<h3 class="text-lg font-semibold text-gray-900">Brukerinformasjon</h3>
					</div>
				</div>
				<div class="p-6">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<dt class="text-sm font-medium text-gray-500">Navn</dt>
							<dd class="mt-1 text-sm text-gray-900">{user.name}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">E-post</dt>
							<dd class="mt-1 text-sm text-gray-900">{user.altEmail || user.email}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">Telefon</dt>
							<dd class="mt-1 text-sm text-gray-900">{user.phone || 'Ikke oppgitt'}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">Rolle</dt>
							<dd class="mt-1">
								<Pill variant={user.role === 'board' ? 'purple' : 'blue'}>
									{user.role === 'board' ? 'Styret' : 'Frivillig'}
								</Pill>
							</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">Kan referere</dt>
							<dd class="mt-1">
								<Pill variant={user.canRefer ? 'green' : 'red'}>
									{user.canRefer ? 'Ja' : 'Nei'}
								</Pill>
							</dd>
						</div>
					</div>
				</div>
			</div>

			<div class="rounded-lg border bg-white">
				<div class="border-b px-6 py-4">
					<h3 class="text-lg font-semibold text-gray-900">Verv stats</h3>
				</div>
				<div class="p-6">
					<div class="space-y-3">
						<div
							class="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0"
						>
							<div class="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400"></div>
							<div class="flex-1">
								<p class="text-sm text-gray-900">Totale referreinger</p>
								<p class="text-xs text-gray-500">{data.referrals.totalReferrals}</p>
							</div>
						</div>
						<div
							class="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0"
						>
							<div class="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-400"></div>
							<div class="flex-1">
								<p class="text-sm text-gray-900">Godkjente referreninger</p>
								<p class="text-xs text-gray-500">{data.referrals.completedReferrals}</p>
							</div>
						</div>
						<div
							class="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0"
						>
							<div class="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-400"></div>
							<div class="flex-1">
								<p class="text-sm text-gray-900">Ventende referreringer</p>
								<p class="text-xs text-gray-500">{data.referrals.pendingReferrals}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="space-y-6">
			<div class="rounded-lg border bg-white">
				<div class="border-b px-6 py-4">
					<h3 class="text-lg font-semibold text-gray-900">Statistikk</h3>
				</div>
				<div class="space-y-4 p-6">
					<div class="flex justify-between">
						<span class="text-sm text-gray-600">Antall ganger stått (sem)</span>
						<span class="text-sm font-semibold text-gray-900">{data.timesVolunteered || 0}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-sm text-gray-600">Antall Bonger</span>
						<span class="text-sm font-semibold text-gray-900">{data.unclaimedBeers || 0}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-sm text-gray-600">Kommende arrangement</span>
						<span class="text-sm font-semibold text-gray-900">
							{data.shifts?.length > 0 ? data.shifts[0].event?.name : 'Ingen'}
						</span>
					</div>
				</div>
			</div>

			<div class="rounded-lg border bg-white">
				<div class="border-b px-6 py-4">
					<h3 class="text-lg font-semibold text-gray-900">Handlinger</h3>
				</div>
				<div class="flex flex-col gap-2 p-6">
					<a
						class="w-full rounded-md px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
						href={mailto(data.user.altEmail || data.user.email)}
					>
						📧 Send e-post
					</a>
					<button
						class="w-full rounded-md px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
						onclick={() => (showAddBeers = true)}
					>
						🍺 Legg til / Fjern bonger
					</button>
					<button
						class="w-full rounded-md px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 {userHasCompletedTraining
							? 'text-green-600'
							: 'text-gray-700'}"
						onclick={() => (showTrainingChecklist = true)}
					>
						{#if userHasCompletedTraining}
							✅ Opplæring fullført
						{:else}
							📋 Start opplæring
						{/if}
					</button>
					<div class="border-t border-gray-200 pt-2">
						<button
							class="w-full rounded-md px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
							onclick={() => (showDeleteConfirm = true)}
						>
							🗑️ Slett bruker
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Training Checklist Component -->
<TrainingChecklist
	userId={user.id}
	userName={user.name}
	isOpen={showTrainingChecklist}
	onclose={() => (showTrainingChecklist = false)}
	onsave={onTrainingSave}
/>

{#if showAddBeers}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs">
		<div class="mx-4 w-full max-w-md rounded-lg border bg-white p-6 shadow-lg">
			<h3 class="mb-2 text-lg font-semibold text-gray-900">Legg til øl</h3>
			<p class="mb-4 text-sm text-gray-600">
				Det du skriver her, vil endre på antall ekstra bonger <strong>{user.name}</strong> har tilgjengelig.
			</p>
			<p class="mb-4 text-sm text-gray-600">Påvirker ikke antall bonger som dei har stått for</p>
			<form
				method="POST"
				action="?/addBeers"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							showAddBeers = false;
							window.location.reload();
						}
					};
				}}
			>
				<div class="mb-4">
					<Input
						type="number"
						name="additionalBeers"
						bind:value={additionalBeers}
						placeholder="Antall øl"
						class="w-full"
					/>
				</div>
				<div class="flex justify-end gap-3">
					<button
						type="button"
						onclick={() => (showAddBeers = false)}
						class="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
					>
						Avbryt
					</button>
					<button
						type="submit"
						class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
					>
						Legg til
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if showDeleteConfirm}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs">
		<div class="mx-4 w-full max-w-md rounded-lg border bg-white p-6 shadow-lg">
			<h3 class="mb-2 text-lg font-semibold text-gray-900">Slett bruker</h3>
			<p class="mb-4 text-sm text-gray-600">
				Er du sikker på at du vil slette <strong>{user.name}</strong>? Skriv inn brukerens navn for
				å bekrefte.
			</p>
			<form
				method="POST"
				action="?/deleteUser"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							showDeleteConfirm = false;
							deleteConfirmName = '';
							showToast((result.data as { message: string }).message);
							setTimeout(() => {
								goto('/portal/admin');
							}, 2000);
						} else {
							console.error('Failed to delete user');
						}
					};
				}}
			>
				<div class="mb-4">
					<Input
						name="confirmDelete"
						bind:value={deleteConfirmName}
						placeholder={user.name}
						class="w-full"
					/>
				</div>
				<div class="flex justify-end gap-3">
					<button
						type="button"
						onclick={() => {
							showDeleteConfirm = false;
							deleteConfirmName = '';
						}}
						class="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
					>
						Avbryt
					</button>
					<button
						type="submit"
						disabled={deleteConfirmName !== user.name}
						class="rounded-md bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Slett bruker
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if toastMessage}
	<div
		class="fixed right-4 bottom-4 z-50 rounded-md border border-green-400 bg-green-100 px-4 py-3 text-green-700 shadow-lg"
	>
		{toastMessage}
	</div>
{/if}
