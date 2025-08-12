<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import type { User } from '$lib/db/schemas';
	import Input from '$lib/components/ui/Input.svelte';

	let { data } = $props();
	let search = $state('');
	let selectedRole = $state('all');
	let sortBy = $state('name');
	let sortOrder = $state<'asc' | 'desc'>('asc');

let filteredUsers = $derived.by(() => {
	const searchTerm = search.toLowerCase();
	return data.users
		.filter((user: User) => {
			const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
				(user.altEmail ?? user.email).toLowerCase().includes(searchTerm);
			return (selectedRole === 'all' || user.role === selectedRole) && matchesSearch;
		})
		.sort((a, b) => {
			const getVal = (u: User) => sortBy === 'name' ? u.name.toLowerCase() : u.role;
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
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<Heading>Admin side</Heading>
		<div class="flex items-center gap-2 text-sm text-gray-600">
			<span class="font-medium">{filteredUsers.length}</span>
			{filteredUsers.length === 1 ? 'bruker' : 'brukere'}
		</div>
	</div>

	<div class="bg-background p-4 rounded-lg border border-gray shadow-sm">
		<div class="flex flex-col sm:flex-row gap-4">
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
					class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				>
					<option value="all">Alle roller</option>
					<option value="board">Styret</option>
					<option value="normal">Frivillige</option>
				</select>
			</div>
		</div>
	</div>

	<div class="bg-background rounded-lg border border-gray shadow-lg overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-200 border-b border-gray">
					<tr>
						<th class="px-6 py-3 text-left">
							<button 
								class="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
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
						<th class="flex items-center px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								E-post
						</th>
						<th class="px-6 py-3 text-left">
							<button 
								class="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
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
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Handlinger
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each filteredUsers as user (user.id)}
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									<div class="flex-shrink-0 h-8 w-8">
										<div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
											<span class="text-sm font-medium text-gray-700">
												{user.name.charAt(0).toUpperCase()}
											</span>
										</div>
									</div>
									<div class="ml-3">
										<div class="text-sm font-medium text-gray-900">{user.name}</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{user.altEmail || user.email}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full border {user.role === 'board' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-blue-100 text-blue-800 border-blue-200'}">
                  {user.role === 'board' ? 'Styret' : 'Frivillig'}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a 
                  href="./admin/user/{user.id}" 
                  class="text-blue-600 hover:text-blue-900 transition-colors font-medium"
                >
                  Vis detaljer
                </a>
							</td>
						</tr>
					{/each}
					{#if filteredUsers.length === 0}
						<tr>
							<td colspan="5" class="px-6 py-12 text-center text-gray-500">
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
