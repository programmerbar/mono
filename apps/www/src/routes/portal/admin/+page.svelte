<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import type { User } from '$lib/db/schemas';
	import Input from '$lib/components/ui/Input.svelte';
	import { initials } from '$lib/utils.js';

	let { data } = $props();
	let search = $state('');
	let selectedRole = $state('all');
	let sortBy = $state('name');
	let sortOrder = $state<'asc' | 'desc'>('asc');

	let filteredUsers = $derived.by(() => {
		const searchTerm = search.toLowerCase();
		return data.users
			.filter((user: User) => {
				const matchesSearch =
					user.name.toLowerCase().includes(searchTerm) ||
					(user.altEmail ?? user.email).toLowerCase().includes(searchTerm);
				return (selectedRole === 'all' || user.role === selectedRole) && matchesSearch;
			})
			.sort((a, b) => {
				const getVal = (u: User) => (sortBy === 'name' ? u.name.toLowerCase() : u.role);
				const comp = getVal(a).localeCompare(getVal(b));
				return sortOrder === 'asc' ? comp : -comp;
			});
	});

	function handleSort(column: string) {
		sortOrder = sortBy === column ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
		sortBy = column;
	}
</script>

<svelte:head>
	<title>Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<Heading>Admin side</Heading>
		<div class="flex items-center gap-2 text-sm text-gray-600">
			<span class="font-medium">{filteredUsers.length}</span>
			{filteredUsers.length === 1 ? 'bruker' : 'brukere'}
		</div>
	</div>

	<div class="border-gray rounded-lg border bg-background p-4 shadow-sm">
		<div class="flex flex-col gap-4 sm:flex-row">
			<div class="flex-1">
				<Input
					class="w-full"
					type="search"
					placeholder="Søk etter navn eller e-post..."
					bind:value={search}
				/>
			</div>
			<div class="sm:w-48">
				<select
					bind:value={selectedRole}
					class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="all">Alle roller</option>
					<option value="board">Styret</option>
					<option value="normal">Frivillige</option>
				</select>
			</div>
		</div>
	</div>

	<div class="block space-y-3 sm:hidden">
		{#each filteredUsers as user (user.id)}
			<div class="border-gray rounded-lg border bg-background p-4 shadow-sm">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="h-10 w-10 flex-shrink-0">
							<div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
								<span class="text-sm font-medium text-gray-700">
									{initials(user.name)}
								</span>
							</div>
						</div>
						<div class="min-w-0 flex-1">
							<div class="truncate text-sm font-medium text-gray-900">{user.name}</div>
							<div class="max-w-32 truncate text-xs text-gray-500">
								{user.altEmail || user.email}
							</div>
						</div>
					</div>
					<div class="flex flex-col items-end gap-2">
						<span
							class="inline-flex rounded-full border px-2 py-1 text-xs font-semibold {user.role ===
							'board'
								? 'border-purple-200 bg-purple-100 text-purple-800'
								: 'border-blue-200 bg-blue-100 text-blue-800'}"
						>
							{user.role === 'board' ? 'Styret' : 'Frivillig'}
						</span>
						<a
							href="./admin/user/{user.id}"
							class="text-xs font-medium text-blue-600 hover:text-blue-900"
						>
							Vis detaljer →
						</a>
					</div>
				</div>
			</div>
		{/each}
		{#if filteredUsers.length === 0}
			<div class="rounded-lg border border-gray-200 bg-background p-8 text-center">
				<div class="flex flex-col items-center gap-2">
					<div class="text-4xl">👤</div>
					<div class="text-sm text-gray-500">Ingen brukere funnet</div>
					{#if search}
						<div class="text-xs text-gray-400">Prøv å endre søkekriteriene</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<div
		class="border-gray hidden overflow-hidden rounded-lg border bg-background shadow-lg sm:block"
	>
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="border-gray border-b bg-gray-200">
					<tr>
						<th class="px-6 py-3 text-left">
							<button
								class="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:text-gray-700"
								onclick={() => handleSort('name')}
							>
								Navn
								{#if sortBy === 'name'}
									<span class="text-gray-400">
										{sortOrder === 'asc' ? '↑' : '↓'}
									</span>
								{/if}
							</button>
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							E-post
						</th>
						<th class="px-6 py-3 text-left">
							<button
								class="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:text-gray-700"
								onclick={() => handleSort('role')}
							>
								Rolle
								{#if sortBy === 'role'}
									<span class="text-gray-400">
										{sortOrder === 'asc' ? '↑' : '↓'}
									</span>
								{/if}
							</button>
						</th>
						<th
							class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Handlinger
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each filteredUsers as user (user.id)}
						<tr class="transition-colors hover:bg-gray-50">
							<td class="whitespace-nowrap px-6 py-4">
								<div class="flex items-center">
									<div class="h-8 w-8 flex-shrink-0">
										<div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
											<span class="text-sm font-medium text-gray-700">
												{initials(user.name)}
											</span>
										</div>
									</div>
									<div class="ml-3">
										<div class="text-sm font-medium text-gray-900">{user.name}</div>
									</div>
								</div>
							</td>
							<td class="whitespace-nowrap px-6 py-4">
								<div class="text-sm text-gray-900">{user.altEmail || user.email}</div>
							</td>
							<td class="whitespace-nowrap px-6 py-4">
								<span
									class="inline-flex rounded-full border px-2 py-1 text-xs font-semibold {user.role ===
									'board'
										? 'border-purple-200 bg-purple-100 text-purple-800'
										: 'border-blue-200 bg-blue-100 text-blue-800'}"
								>
									{user.role === 'board' ? 'Styret' : 'Frivillig'}
								</span>
							</td>
							<td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
								<a
									href="./admin/user/{user.id}"
									class="font-medium text-blue-600 transition-colors hover:text-blue-900"
								>
									Vis detaljer
								</a>
							</td>
						</tr>
					{/each}
					{#if filteredUsers.length === 0}
						<tr>
							<td colspan="4" class="px-6 py-12 text-center text-gray-500">
								<div class="flex flex-col items-center gap-2">
									<div class="text-4xl">👤</div>
									<div class="text-sm">Ingen brukere funnet</div>
									{#if search}
										<div class="text-xs text-gray-400">Prøv å endre søkekriteriene</div>
									{/if}
								</div>
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
