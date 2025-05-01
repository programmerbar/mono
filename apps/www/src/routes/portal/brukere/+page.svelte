<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { X } from '@lucide/svelte';
	import AddUserModal from '$lib/components/portal/AddUserModal.svelte';
	import { mailto } from '$lib/utils';
	import { formatDate } from '$lib/date';
	import UserCard from '$lib/components/cards/UserCard.svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();

	let search = $state('');

	let filteredUsers = $derived.by(() =>
		data.users.filter((user) => {
			return user.name.toLowerCase().includes(search.toLowerCase());
		})
	);
</script>

<svelte:head>
	<title>Brukere</title>
</svelte:head>

<section class="space-y-6">
	<Heading>Brukere</Heading>

	<div class="flex items-center gap-2">
		<Input type="search" class="w-full flex-1" placeholder="Søk etter bruker" bind:value={search} />
		<AddUserModal />
	</div>

	<ul class="grid grid-cols-1 gap-4 md:grid-cols-3">
		{#each filteredUsers as user}
			<li>
				<UserCard {user} />
			</li>
		{:else}
			<li class="block col-span-3 text-center py-4">
				<p>Fant ingen bruker</p>
			</li>
		{/each}
	</ul>
</section>

{#if data.invitations.length > 0}
	<hr class="my-12 border-t border-gray-200" />
	<section class="mt-12 space-y-6">
		<Heading>Invitasjoner</Heading>

		<ul class="grid grid-cols-1 gap-4 md:grid-cols-3">
			{#each data.invitations as invitation}
				<li class="relative block rounded-lg border bg-white p-4">
					<form method="post" action="?/deleteInvitation" use:enhance>
						<input name="invitationId" hidden value={invitation.id} />
						<button class="absolute right-2 top-2 h-6 w-6 cursor-pointer text-gray-500">
							<X class="h-6 w-6 text-gray-500" />
						</button>
					</form>

					<p class="text-sm">
						<span class="font-medium">E-post:</span>
						<a class="hover:underline" href={mailto(invitation.email)}>{invitation.email}</a>
					</p>
					<p class="text-sm">
						<span class="font-medium">Sendt:</span>
						{formatDate(invitation.createdAt)}
					</p>
					<p class="text-sm">
						<span class="font-medium">Utgår:</span>
						{formatDate(invitation.expiresAt)}
					</p>
				</li>
			{:else}
				<li class="block col-span-3 text-center py-4">
					<p>Ingen invitasjoner</p>
				</li>
			{/each}
		</ul>
	</section>
{/if}
