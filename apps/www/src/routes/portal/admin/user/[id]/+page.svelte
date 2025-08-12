<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import type { User } from '$lib/db/schemas';
	import { initials, mailto } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let user = data.user as User;
	let isEditing = $state(false);
	let editForm = $state({
		name: data.user.name,
		email: data.user.altEmail || user.email,
		role: data.user.role,
		phone: data.user.phone || '',
		notes: data.user.notes || ''
	});
	let showDeleteConfirm = $state(false);
	let showAddBeers = $state(false);
	let additionalBeers = $state(0);
	let deleteConfirmName = $state('');
	let isSubmitting = $state(false);
  let knowTheShit = $state(false);
  let toastMessage = $state('');

  function showToast(message: string) {
    toastMessage = message;
    setTimeout(() => {
      toastMessage = '';
    }, 3000);
  }

	function toggleEdit() {
		if (isEditing) {
			// Reset form if canceling
			editForm = {
        name: data.user.name,
        email: data.user.altEmail || user.email,
        role: data.user.role,
        phone: data.user.phone || '',
        notes: data.user.notes || ''
			};
		}
		isEditing = !isEditing;
	}

	function getRoleBadgeClass(role: string) {
		switch (role) {
			case 'board':
				return 'bg-purple-100 text-purple-800 border-purple-200';
			case 'normal':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'admin':
				return 'bg-red-100 text-red-800 border-red-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	}

	function getRoleLabel(role: string) {
		switch (role) {
			case 'board':
				return 'Styret';
			case 'normal':
				return 'Frivillig';
			case 'admin':
				return 'Administrator';
			default:
				return role;
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

	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<div class="flex items-start justify-between">
			<div class="flex items-center gap-4">
				<div class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300">
					<span class="text-2xl font-semibold text-gray-700">
						{user.name.charAt(0).toUpperCase()}
					</span>
				</div>
				<div>
					<Heading class="mb-1">{user.name}</Heading>
					<div class="flex items-center gap-3">
						<span
							class="inline-flex rounded-full border px-3 py-1 text-sm font-semibold {getRoleBadgeClass(
								user.role
							)}"
						>
							{getRoleLabel(user.role)}
						</span>
					</div>
				</div>
			</div>
			<div class="flex gap-2">
				{#if !isEditing}
					<button
						onclick={toggleEdit}
						class="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
					>
						Rediger
					</button>
				{:else}
					<button
						onclick={toggleEdit}
						class="rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400"
						disabled={isSubmitting}
					>
						Avbryt
					</button>
					
					<form
						method="POST"
						action="?/updateUser"
						class="inline"
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
						<input type="hidden" name="name" value={editForm.name} />
						<input type="hidden" name="email" value={editForm.email} />
						<input type="hidden" name="role" value={editForm.role} />
						<input type="hidden" name="phone" value={editForm.phone} />
						<input type="hidden" name="notes" value={editForm.notes} />
						
						<button
							type="submit"
							class="rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:opacity-50"
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Lagrer...' : 'Lagre'}
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- Main Info -->
		<div class="space-y-6 lg:col-span-2">
			<!-- Basic Information -->
			<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
				<div class="border-b border-gray-200 px-6 py-4">
					<h3 class="text-lg font-semibold text-gray-900">Brukerinformasjon</h3>
				</div>
				<div class="space-y-4 p-6">
					{#if isEditing}
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-700">Navn</label>
								<Input bind:value={editForm.name} placeholder="Fullt navn" />
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-700">E-post</label>
								<Input bind:value={editForm.email} type="email" placeholder="bruker@eksempel.no" />
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-700">Telefon</label>
								<Input bind:value={editForm.phone} type="tel" placeholder="+47 123 45 678" />
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-700">Rolle</label>
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
											  hover:bg-gray-200 peer-checked:border-transparent peer-checked:bg-blue-600
											  peer-checked:text-white transition-colors"
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
											  hover:bg-gray-200 peer-checked:border-transparent peer-checked:bg-purple-600
											  peer-checked:text-white transition-colors"
										>
											Styret
										</span>
									</label>

									<label class="relative cursor-pointer">
										<input
											type="radio"
											name="role"
											value="admin"
											class="peer hidden"
											bind:group={editForm.role}
										/>
										<span
											class="flex items-center justify-center rounded-xl border px-2 py-px text-sm
											  hover:bg-gray-200 peer-checked:border-transparent peer-checked:bg-red-600
											  peer-checked:text-white transition-colors"
										>
											Administrator
										</span>
									</label>
								</div>
							</div>
						</div>
						<div>
							<label class="mb-1 block text-sm font-medium text-gray-700">Notater</label>
							<textarea
								bind:value={editForm.notes}
								rows="3"
								class="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Interne notater om brukeren..."
							></textarea>
						</div>
					{:else}
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div>
								<dt class="text-sm font-medium text-gray-500">Navn</dt>
								<dd class="mt-1 text-sm text-gray-900">{user.name}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">E-post</dt>
								<dd class="mt-1 text-sm text-gray-900">{user.email || 'Ikke oppgitt'}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">Telefon</dt>
								<dd class="mt-1 text-sm text-gray-900">{user.phone || 'Ikke oppgitt'}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">Rolle</dt>
								<dd class="mt-1">
									<span
										class="inline-flex rounded-full border px-2 py-1 text-xs font-semibold {getRoleBadgeClass(
											user.role
										)}"
									>
										{getRoleLabel(user.role)}
									</span>
								</dd>
							</div>
							{#if user.notes}
								<div class="md:col-span-2">
									<dt class="text-sm font-medium text-gray-500">Notater</dt>
									<dd class="mt-1 text-sm text-gray-900">{user.notes}</dd>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			</div>

			<!-- Activity Log -->
			<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
				<div class="border-b border-gray-200 px-6 py-4">
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
			<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
				<div class="border-b border-gray-200 px-6 py-4">
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
						<span class="text-sm text-gray-600">Kommende arrangemennt</span>
						<span class="text-sm font-semibold text-gray-900">I dag</span>
					</div>
				</div>
			</div>

			<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
				<div class="border-b border-gray-200 px-6 py-4">
					<h3 class="text-lg font-semibold text-gray-900">Handlinger</h3>
				</div>
				<div class="space-y-2 p-6">
					<a
						href="mailto:{data.user.altEmail || data.user.email}"
						class="w-full rounded-md px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
					>
						📧 Send e-post
					</a>
					<button
						onclick={() => (showAddBeers = true)}
						class="w-full rounded-md px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
					>
						🍺 Legg til / Fjern bonger
					</button>
					<button
						class="w-full rounded-md px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
					>
          {#if knowTheShit === false}  
						❌ Fått opplæring?
          {:else}
            ✅ Fått opplæring
          {/if}
					</button>
					<div class="border-t border-gray-200 pt-2">
						<button
							onclick={() => (showDeleteConfirm = true)}
							class="w-full rounded-md px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
						>
							🗑️ Slett bruker
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

{#if showAddBeers}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="mx-4 w-full max-w-md rounded-lg bg-white p-6">
			<h3 class="mb-2 text-lg font-semibold text-gray-900">Legg til øl</h3>
			<p class="mb-4 text-sm text-gray-600">
        Det du srkiver her, vil endre på antall ekstra bonger <strong>{user.name}</strong>  har tilgjengelig.
			</p>
			<p class="mb-4 text-sm text-gray-600">
        Påvirker ikke antall bonger som dei har stått for
			</p>
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
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="mx-4 w-full max-w-md rounded-lg bg-white p-6">
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
        showToast(result.data.message);

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
	<div class="fixed bottom-4 right-4 z-50 rounded-md bg-green-100 border border-green-400 px-4 py-3 text-green-700 shadow-lg">
		{toastMessage}
	</div>
{/if}
