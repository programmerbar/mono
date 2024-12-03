<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import UserCard from '$lib/components/Usercards/UserCard.svelte';
	import UserDetailModal from '$lib/components/Usercards/UserDetailModal.svelte';

	export let data;

	let search = '';
	let currentUserRole = data.user.role;

	$: boardMembers = data.users.filter((user) => {
		return user.role === 'board' && user.name.toLowerCase().includes(search.toLowerCase());
	});

	$: normalMembers = data.users.filter((user) => {
		return user.role === 'normal' && user.name.toLowerCase().includes(search.toLowerCase());
	});

	let selectedUser = null;
	let isModalOpen = false;

	async function handleUserClick(event) {
		const userId = event.detail.user.id;
		console.log('Fetching details for user ID:', userId);

		try {
			const response = await fetch(`/portal/admin/user/${userId}`);
			if (response.ok) {
				const detailedUser = await response.json();
				console.log('Detailed user data:', detailedUser);
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

	async function updateRole(userId: string, newRole: string) {
		const formData = new FormData();
		formData.append('userId', userId);
		formData.append('role', newRole);

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
	<title>Admin - User Management</title>
</svelte:head>

<!-- Include the UserDetailModal -->
{#if isModalOpen && selectedUser}
	<UserDetailModal {selectedUser} on:close={closeModal} />
{/if}

<section class="space-y-6">
	<Heading>Styret</Heading>
	<ul class="grid grid-cols-1 gap-4 md:grid-cols-3">
		{#each boardMembers as user}
			<UserCard
				{user}
				{currentUserRole}
				showMenu={true}
				on:roleChange={(e) => updateRole(e.detail.userId, e.detail.newRole)}
				on:click={handleUserClick}
			/>
		{/each}
	</ul>
</section>

<section class="mt-12 space-y-6">
	<Heading>Frivillige</Heading>
	<!-- Need to add search.role = board, to make this work (Har ikkje gidda endå)
	<div class="flex items-center gap-2">
		<input
			type="search"
			class="w-full flex-1 p-2 border rounded"
			placeholder="Søk etter frivillige"
			bind:value={search}
		/>
	</div>
-->
	<ul class="grid grid-cols-1 gap-4 md:grid-cols-3">
		{#each normalMembers as user}
			<UserCard
				{user}
				{currentUserRole}
				showMenu={true}
				on:roleChange={(e) => updateRole(e.detail.userId, e.detail.newRole)}
				on:click={handleUserClick}
			/>
		{/each}
	</ul>
</section>
