<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import UserCard from '$lib/components/cards/UserCard.svelte';
	import UserDetailModal from '$lib/components/cards/UserDetailModal.svelte';
	import type { User } from '$lib/db/schema';
	import Input from '$lib/components/ui/Input.svelte';

	let { data } = $props();

	let search = $state('');

	let currentUserRole = $state(data.user.role);

	let boardMembers = $derived.by(() =>
		data.users.filter((user: User) => {
			return user.role === 'board' && user.name.toLowerCase().includes(search.toLowerCase());
		})
	);

	let normalMembers = $derived.by(() =>
		data.users.filter((user: User) => {
			return user.role === 'normal' && user.name.toLowerCase().includes(search.toLowerCase());
		})
	);

	let selectedUser = $state<
		| (User & {
				timesVolunteered: number;
				unclaimedBeers: number;
		  })
		| null
	>(null);

	let isModalOpen = $state(false);

	async function handleUserClick(user: User) {
		const userId = user.id;

		try {
			const response = await fetch(`/portal/admin/user/${userId}`);
			if (response.ok) {
				const detailedUser = (await response.json()) as User & {
					timesVolunteered: number;
					unclaimedBeers: number;
				};
				selectedUser = detailedUser;
				isModalOpen = true;
			} else {
				console.error('Failed to fetch user details');
			}
		} catch (error) {
			console.error('Error fetching user details:', error);
		}
	}

	function closeModal() {
		selectedUser = null;
		isModalOpen = false;
	}

	async function updateRole(userId: string, newRole: 'board' | 'normal') {
		const formData = new FormData();
		formData.append('userId', userId);
		formData.append('role', newRole);
		formData.append('/', 'updateRole');

		try {
			const response = await fetch('/portal/admin', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				data.users = data.users.map((user: User) => {
					if (user.id === userId) {
						return { ...user, role: newRole };
					}
					return user;
				});
			} else {
				console.error('Failed to update user role');
			}
		} catch (error) {
			console.error('Error updating user role:', error);
		}
	}
</script>

<svelte:head>
	<title>Admin - User Management</title>
</svelte:head>

{#if isModalOpen && selectedUser}
	<UserDetailModal
		{selectedUser}
		{currentUserRole}
		onClose={closeModal}
		roleChange={(event) => updateRole(event.userId, event.newRole)}
	/>
{/if}

<section class="space-y-6">
	<Heading>Styret</Heading>
	<ul class="grid grid-cols-1 gap-4 md:grid-cols-3">
		{#each boardMembers as user (user.id)}
			<UserCard {user} onSelect={handleUserClick} />
		{/each}
	</ul>
</section>

<section class="mt-12 space-y-6">
	<Heading>Frivillige</Heading>
	<Input type="search" placeholder="Søk etter frivillige" bind:value={search} />
	<ul class="grid grid-cols-1 gap-4 md:grid-cols-3">
		{#each normalMembers as user (user.id)}
			<UserCard {user} onSelect={() => handleUserClick(user)} />
		{/each}
	</ul>
</section>
