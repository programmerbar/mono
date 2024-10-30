<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import AddUserModal from '$lib/components/portal/AddUserModal.svelte';
	import { mailto } from '$lib/utils';
	import { formatDate } from '$lib/date';
	import UserCard from '$lib/components/Usercards/UserCard.svelte';

	export let data;

	let search = '';

	$: filteredUsers = data.users.filter((user) => {
		return user.name.toLowerCase().includes(search.toLowerCase());
	});
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
			<UserCard {user} />
		{:else}
			<li class="block col-span-3 text-center py-4">
				<p>Fant ingen bruker</p>
			</li>
		{/each}
	</ul>
</section>

<section class="mt-12 space-y-6">
	<Heading>Invitasjoner</Heading>

	<ul class="grid grid-cols-1 gap-4 md:grid-cols-3">
		{#each data.invitations as invitation}
			<li class="block rounded-lg border bg-white p-4">
				<p class="text-sm">
					<span class="font-medium">E-post:</span>
					<a class="hover:underline" href={mailto(invitation.email)}>{invitation.email}</a>
				</p>
				<p class="text-sm">
					<span class="font-medium">Sendt:</span>
					{formatDate(invitation.createdAt)}
				</p>
				<p class="text-sm">
					<span class="font-medium">Utg�r:</span>
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
