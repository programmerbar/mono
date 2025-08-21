<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { initials } from '$lib/utils';
	import { enhance } from '$app/forms';
	import type { User } from '$lib/db/schemas';

	let { data, form } = $props();
	let user = $state(data.user as User);
	let isEditing = $state(false);

	let editForm = $state({
		altEmail: data.user.altEmail || '',
		phone: data.user.phone || ''
	});

	let isSubmitting = $state(false);
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
				altEmail: data.user.altEmail || '',
				phone: data.user.phone || ''
			};
		}
		isEditing = !isEditing;
	}
</script>

<svelte:head>
	<title>Min Profil</title>
</svelte:head>

<div class="space-y-6">
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
						<span
							class="inline-flex rounded-full border px-3 py-1 text-sm font-semibold {user.role ===
							'board'
								? 'border-purple-200 bg-purple-100 text-purple-800'
								: 'border-blue-200 bg-blue-100 text-blue-800'}"
						>
							{user.role === 'board' ? 'Styret' : 'Frivillig'}
						</span>
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
						action="?/save"
						class="w-full sm:w-auto"
						use:enhance={() => {
							isSubmitting = true;
							return async ({ result }) => {
								isSubmitting = false;
								if (result.type === 'success') {
									user = { ...user, ...editForm };
									isEditing = false;
									showToast('Profil oppdatert');
								} else {
									console.error('Failed to save profile');
									showToast('Feil ved lagring');
								}
							};
						}}
					>
						<input type="hidden" name="altEmail" value={editForm.altEmail} />
						<input type="hidden" name="phone" value={editForm.phone} />

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
								<dt class="text-sm font-medium text-gray-500">Hovedepost</dt>
								<dd class="mt-1 text-sm text-gray-900">{data.user.email}</dd>
							</div>
							<div>
								<label for="edit-email" class="mb-1 block text-sm font-medium text-gray-700"
									>Alternativ e-post</label
								>
								<Input
									id="edit-email"
									bind:value={editForm.altEmail}
									type="email"
									placeholder="din.alternativ@epost.no"
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
						</div>
					{:else}
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div>
								<dt class="text-sm font-medium text-gray-500">Navn</dt>
								<dd class="mt-1 text-sm text-gray-900">{user.name}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">Hovedepost</dt>
								<dd class="mt-1 text-sm text-gray-900">{user.email}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">Alternativ e-post</dt>
								<dd class="mt-1 text-sm text-gray-900">{user.altEmail || 'Ikke oppgitt'}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">Telefon</dt>
								<dd class="mt-1 text-sm text-gray-900">{user.phone || 'Ikke oppgitt'}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">Rolle</dt>
								<dd class="mt-1">
									<span
										class="inline-flex rounded-full border px-2 py-1 text-xs font-semibold {user.role ===
										'board'
											? 'border-purple-200 bg-purple-100 text-purple-800'
											: 'border-blue-200 bg-blue-100 text-blue-800'}"
									>
										{user.role === 'board' ? 'Styret' : 'Frivillig'}
									</span>
								</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">Opplæring</dt>
								<dd class="mt-1">
									<span
										class="inline-flex rounded-full border px-2 py-1 text-xs font-semibold {user.isTrained
											? 'border-green-200 bg-green-100 text-green-800'
											: 'border-yellow-200 bg-yellow-100 text-yellow-800'}"
									>
										{user.isTrained ? 'Fullført' : 'Ikke fullført'}
									</span>
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
								<p class="text-sm text-gray-900">Totale referreringer</p>
								<p class="text-xs text-gray-500">{data.referrals.totalReferrals}</p>
							</div>
						</div>
						<div
							class="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0"
						>
							<div class="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-400"></div>
							<div class="flex-1">
								<p class="text-sm text-gray-900">Godkjente referreringer</p>
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
		</div>
	</div>
</div>

{#if toastMessage}
	<div
		class="fixed right-4 bottom-4 z-50 rounded-md border border-green-400 bg-green-100 px-4 py-3 text-green-700 shadow-lg"
	>
		{toastMessage}
	</div>
{/if}
