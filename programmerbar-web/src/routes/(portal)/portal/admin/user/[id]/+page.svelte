<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import TrainingChecklist from '$lib/components/portal/Training.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import type { User } from '$lib/db/schemas';
	import { initials, mailto } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let user = $state(data.user as User);
	let isEditing = $state(false);

	let editForm = $state({
		email: data.user.altEmail || data.user.email,
		role: data.user.role,
		phone: data.user.phone || '',
		canRefer: data.user.canRefer ?? true
	});

	let showDeleteConfirm = $state(false);
	let showAddBeers = $state(false);
	let showTrainingChecklist = $state(false);
	let additionalBeers = $state(0);
	let deleteConfirmName = $state('');
	let isSubmitting = $state(false);

	let userHasCompletedTraining = $state(data.user.isTrained || false);

	let toastMessage = $state('');

	function showToast(message: string) {
		toastMessage = message;
		setTimeout(() => {
			toastMessage = '';
		}, 3000);
	}

	function toggleEdit() {
		if (isEditing) {
			editForm = {
				email: data.user.altEmail || data.user.email,
				role: data.user.role,
				phone: data.user.phone || '',
				canRefer: data.user.canRefer ?? true
			};
		}
		isEditing = !isEditing;
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
	<a
		class="flex items-center gap-4 text-gray-500 transition-colors hover:text-gray-700"
		href="/portal/admin/"
	>
		← Tilbake til admin page
	</a>

	<div class="border-gray bg-background rounded-2xl border-2 p-4 shadow-lg sm:p-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
			<div class="flex items-center gap-4">
				<div class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300">
					<span class="text-2xl font-semibold text-gray-700">
						{initials(data.user.name)}
					</span>
				</div>
				<div class="min-w-0 flex-1">
					<Heading class="mb-1 truncate">{user.name}</Heading>
					<div class="flex items-center gap-3">
						<StatusBadge
							status={user.role === 'board' ? 'board' : 'normal'}
							text={user.role === 'board' ? 'Styret' : 'Frivillig'}
						/>
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-2 sm:flex-row sm:gap-2">
				{#if !isEditing}
					<Button onclick={toggleEdit} intent="primary">Rediger</Button>
				{:else}
					<Button onclick={toggleEdit} intent="outline" disabled={isSubmitting}>Avbryt</Button>

					<form
						method="POST"
						action="?/updateUser"
						class="w-full sm:w-auto"
						use:enhance={() => {
							isSubmitting = true;
							return async ({ result }) => {
								isSubmitting = false;
								if (result.type === 'success') {
									user = { ...user, ...editForm };
									isEditing = false;
									showToast(`${user.name} oppdatert`);
								} else {
									console.error('Failed to save user');
									showToast('Feil ved lagring');
								}
							};
						}}
					>
						<input type="hidden" name="email" value={editForm.email} />
						<input type="hidden" name="role" value={editForm.role} />
						<input type="hidden" name="phone" value={editForm.phone} />
						<input type="hidden" name="canRefer" value={editForm.canRefer} />

						<Button type="submit" intent="primary" disabled={isSubmitting} class="w-full">
							{isSubmitting ? 'Lagrer...' : 'Lagre'}
						</Button>
					</form>
				{/if}
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<div class="space-y-6 lg:col-span-2">
			<div class="border-gray bg-background overflow-auto rounded-2xl border-2 shadow-lg">
				<div class="border-b-2 border-gray-200 bg-gray-200 px-6 py-4">
					<h3 class="text-lg font-semibold text-gray-900">Brukerinformasjon</h3>
				</div>
				<div class="space-y-4 p-6">
					{#if isEditing}
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<dt class="text-sm font-medium text-gray-500">Navn</dt>
								<dd class="mt-1 text-sm text-gray-900">{data.user.name}</dd>
							</div>
							<div>
								<label for="edit-email" class="mb-1 block text-sm font-medium text-gray-700"
									>E-post</label
								>
								<Input
									id="edit-email"
									bind:value={editForm.email}
									type="email"
									placeholder="ola.nordmann@eksempel.no"
								/>
							</div>
							<div>
								<label for="edit-phone" class="mb-1 block text-sm font-medium text-gray-700"
									>Telefon</label
								>
								<Input
									id="edit-phone"
									bind:value={editForm.phone}
									type="tel"
									placeholder="+47 123 45 678"
								/>
							</div>
							<div>
								<div class="mb-1 block text-sm font-medium text-gray-700">Rolle</div>
								<div class="flex items-center gap-2">
									<label class="relative cursor-pointer">
										<input
											type="radio"
											name="role"
											value="normal"
											class="peer hidden"
											bind:group={editForm.role}
										/>
										<span
											class="flex items-center justify-center rounded-xl border px-2 py-px text-sm
											  transition-colors peer-checked:border-transparent peer-checked:bg-blue-600
											  peer-checked:text-white hover:bg-gray-200"
										>
											Frivillig
										</span>
									</label>

									<label class="relative cursor-pointer">
										<input
											type="radio"
											name="role"
											value="board"
											class="peer hidden"
											bind:group={editForm.role}
										/>
										<span
											class="flex items-center justify-center rounded-xl border px-2 py-px text-sm
											  transition-colors peer-checked:border-transparent peer-checked:bg-purple-600
											  peer-checked:text-white hover:bg-gray-200"
										>
											Styret
										</span>
									</label>
								</div>
							</div>
							<div>
								<div class="mb-1 block text-sm font-medium text-gray-700">Kan referere?</div>
								<label class="flex cursor-pointer items-center gap-2">
									<input
										type="checkbox"
										bind:checked={editForm.canRefer}
										class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<span class="text-sm text-gray-900">
										{editForm.canRefer ? 'Ja' : 'Nei'}
									</span>
								</label>
							</div>
						</div>
					{:else}
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
									<StatusBadge
										status={user.role === 'board' ? 'board' : 'normal'}
										text={user.role === 'board' ? 'Styret' : 'Frivillig'}
										size="sm"
									/>
								</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">Kan referere</dt>
								<dd class="mt-1">
									<StatusBadge
										status={user.canRefer ? 'approved' : 'rejected'}
										text={user.canRefer ? 'Ja' : 'Nei'}
										size="sm"
									/>
								</dd>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<div class="border-gray bg-background overflow-auto rounded-2xl border-2 shadow-lg">
				<div class="border-b-2 border-gray-200 bg-gray-200 px-6 py-4">
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
			<div class="border-gray bg-background overflow-auto rounded-2xl border-2 shadow-lg">
				<div class="border-b-2 border-gray-200 bg-gray-200 px-6 py-4">
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

			<div class="border-gray bg-background overflow-auto rounded-2xl border-2 shadow-lg">
				<div class="border-b-2 border-gray-200 bg-gray-200 px-6 py-4">
					<h3 class="text-lg font-semibold text-gray-900">Handlinger</h3>
				</div>
				<div class="space-y-2 p-6">
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

<TrainingChecklist
	userId={user.id}
	userName={user.name}
	isOpen={showTrainingChecklist}
	onclose={() => (showTrainingChecklist = false)}
	onsave={onTrainingSave}
/>

{#if showAddBeers}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
		<div class="bg-background mx-4 w-full max-w-md rounded-2xl border-2 p-6 shadow-lg">
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
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
		<div class="bg-background mx-4 w-full max-w-md rounded-2xl border-2 p-6 shadow-lg">
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
