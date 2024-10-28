<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import { mailto, initials } from '$lib/utils';
	import Input from '$lib/components/ui/Input.svelte';
	import AddUserModal from '$lib/components/portal/AddUserModal.svelte';
	import { formatDate } from '$lib/date';

	let { data } = $props();

	let search = $state('');

	let filteredUsers = $derived.by(() =>
		data.users.filter((user) => {
			return user.name.toLowerCase().includes(search.toLowerCase());
		})
	);
</script>

<section class="space-y-6">
	<Heading>Brukere</Heading>

	<div class="flex items-center gap-2">
		<Input type="search" class="w-full flex-1" placeholder="Søk etter bruker" bind:value={search} />
		<AddUserModal />
	</div>

	<ul class="grid grid-cols-1 md:grid-cols-3 gap-4">
		{#each filteredUsers as user}
			<li class="block bg-white border rounded-lg p-4">
				<div class="flex justify-center mb-2">
					<div class="w-16 h-16 bg-gray-200 flex items-center justify-center border rounded-full">
						<span class="font-medium text-gray-600 text-lg">{initials(user.name)}</span>
					</div>
				</div>

				<div>
					<p class="font-medium text-center">{user.name}</p>
					<p class="text-center text-sm">
						<a class="hover:underline" href={mailto(user.email)}>{user.email}</a>
					</p>
				</div>
			</li>
		{:else}
			<li class="block col-span-3 text-center py-4">
				<p>Fant ingen bruker</p>
			</li>
		{/each}
	</ul>
</section>

<section class="mt-12 space-y-6">
	<Heading>Invitasjoner</Heading>

	<ul class="grid grid-cols-1 md:grid-cols-3 gap-4">
		{#each data.invitations as invitation}
			<li class="block bg-white border rounded-lg p-4">
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
