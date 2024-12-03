<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import UserCard from '$lib/components/Usercards/UserCard.svelte';
	import UserDetailModal from '$lib/components/Usercards/UserDetailModal.svelte';

	let { data } = $props();

	let search = $state('');

	let currentUserRole = $state(data.user.role);

	let boardMembers = $derived.by(() =>
		data.users.filter((user) => {
			return user.role === 'board' && user.name.toLowerCase().includes(search.toLowerCase());
		})
	);

	let normalMembers = $derived.by(() =>
		data.users.filter((user) => {
			return user.role === 'normal' && user.name.toLowerCase().includes(search.toLowerCase());
		})
	);

	let selectedUser = $state(null);
	let isModalOpen = $state(false);

	async function handleUserClick(event: CustomEvent) {
		const userId = event.detail.user.id;

		try {
			const response = await fetch(`/portal/admin/user/${userId}`);
			if (response.ok) {
				const detailedUser = await response.json();
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
				data.users = data.users.map((user) => {
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
	<title>Admin - User Manegment</title>
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
		{#each boardMembers as user}
			<UserCard {user} onclick={handleUserClick} />
		{/each}
	</ul>
</section>

<section class="mt-12 space-y-6">
	<Heading>Frivillige</Heading>
	<div class="flex items-center gap-2">
		<input
			type="search"
			class="w-full flex-1 rounded border p-2"
			placeholder="Søk etter frivillige"
		/>
	</div>
	<ul class="grid grid-cols-1 gap-4 md:grid-cols-3">
		{#each normalMembers as user}
			<UserCard
				{user}
				{currentUserRole}
				roleChange={(e) => updateRole(e.detail.userId, e.detail.newRole)}
				onclick={handleUserClick}
			/>
		{/each}
	</ul>
</section>
