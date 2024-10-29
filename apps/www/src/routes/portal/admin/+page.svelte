<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import UserCard from '$lib/components/Usercards/usercard.svelte';
	import { invalidate } from '$app/navigation';

	export let data;

	let search = '';
	let currentUserRole = data.user.role; // Get the current user's role

	$: boardMembers = data.users.filter((user) => {
		return user.role === 'board' && user.name.toLowerCase().includes(search.toLowerCase());
	});

	$: normalMembers = data.users.filter((user) => {
		return user.role === 'normal' && user.name.toLowerCase().includes(search.toLowerCase());
	});

	async function updateRole(userId: string, newRole: string) {
		const formData = new FormData();
		formData.append('userId', userId);
		formData.append('role', newRole);

		const response = await fetch('/portal/admin?/updateRole', {
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
	}
</script>

<!-- Board Members Section -->
<section class="space-y-6">
	<Heading>Styret</Heading>
	<ul class="grid grid-cols-1 md:grid-cols-3 gap-4">
		{#each boardMembers as user}
			<UserCard
				{user}
				{currentUserRole}
				showMenu={true}
				on:roleChange={(e) => updateRole(e.detail.userId, e.detail.newRole)}
			/>
		{/each}
	</ul>
</section>

<!-- Normal Members Section -->
<section class="mt-12 space-y-6">
	<Heading>Frivillige</Heading>

	<div class="flex items-center gap-2">
		<input
			type="search"
			class="w-full flex-1 p-2 border rounded"
			placeholder="Søk etter frivillige"
			bind:value={search}
		/>
	</div>

	<ul class="grid grid-cols-1 md:grid-cols-3 gap-4">
		{#each normalMembers as user}
			<UserCard
				{user}
				{currentUserRole}
				showMenu={true}
				on:roleChange={(e) => updateRole(e.detail.userId, e.detail.newRole)}
			/>
		{/each}
	</ul>
</section>
