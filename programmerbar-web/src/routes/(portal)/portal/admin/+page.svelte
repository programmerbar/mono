<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Pill from '$lib/components/ui/Pill.svelte';
	import type { User } from '$lib/db/schemas';
	import { initials } from '$lib/utils.js';
	import { Users, Search, ChevronUp, ChevronDown, Eye, UserCog } from '@lucide/svelte';

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
	<!-- Header -->
	<div class="flex items-center gap-3">
		<UserCog class="h-6 w-6 text-gray-600" />
		<div>
			<Heading>Brukerhåndtering</Heading>
			<p class="mt-1 text-gray-600">
				Administrer alle {data.users.length} registrerte brukere
			</p>
		</div>
		{#if filteredUsers.length !== data.users.length}
			<div class="ml-auto">
				<Pill variant="blue">{filteredUsers.length} av {data.users.length}</Pill>
			</div>
		{/if}
	</div>

	<!-- Search and Filters -->
	<div class="rounded-lg border bg-white p-4">
		<div class="flex flex-col gap-3 sm:flex-row">
			<div class="flex-1">
				<div class="relative">
					<Search
						class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
					/>
					<Input
						class="w-full border-1 pl-10"
						type="search"
						placeholder="Søk etter navn eller e-post..."
						bind:value={search}
					/>
				</div>
			</div>
			<div>
				<Select
					bind:value={selectedRole}
					options={[
						{ label: 'Alle roller', value: 'all' },
						{ label: 'Styret', value: 'board' },
						{ label: 'Frivillige', value: 'normal' }
					]}
				/>
			</div>
		</div>
	</div>

	<!-- Mobile View -->
	<div class="block space-y-3 sm:hidden">
		{#each filteredUsers as user (user.id)}
			<div class="rounded-lg border bg-white p-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="h-10 w-10 flex-shrink-0">
							<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
								<span class="text-sm font-medium text-blue-600">
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
						<Pill variant={user.role === 'board' ? 'purple' : 'blue'}>
							{user.role === 'board' ? 'Styret' : 'Frivillig'}
						</Pill>
						<a
							href="./admin/bruker/{user.id}"
							class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-900"
						>
							<Eye class="h-3 w-3" />
							Vis detaljer
						</a>
					</div>
				</div>
			</div>
		{/each}
		{#if filteredUsers.length === 0}
			<div class="rounded-lg border bg-white p-8 text-center">
				<div class="flex flex-col items-center gap-2">
					<Users class="h-12 w-12 text-gray-300" />
					<div class="text-lg font-medium text-gray-500">Ingen brukere funnet</div>
					{#if search}
						<div class="text-sm text-gray-400">Prøv å endre søkekriteriene</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<!-- Desktop Table View -->
	<div class="hidden overflow-hidden rounded-lg border bg-white sm:block">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="border-b bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left">
							<button
								class="flex items-center gap-2 text-xs font-medium tracking-wider text-gray-500 uppercase transition-colors hover:text-gray-700"
								onclick={() => handleSort('name')}
							>
								Navn
								{#if sortBy === 'name'}
									{#if sortOrder === 'asc'}
										<ChevronUp class="h-3 w-3" />
									{:else}
										<ChevronDown class="h-3 w-3" />
									{/if}
								{/if}
							</button>
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							E-post
						</th>
						<th class="px-6 py-3 text-left">
							<button
								class="flex items-center gap-2 text-xs font-medium tracking-wider text-gray-500 uppercase transition-colors hover:text-gray-700"
								onclick={() => handleSort('role')}
							>
								Rolle
								{#if sortBy === 'role'}
									{#if sortOrder === 'asc'}
										<ChevronUp class="h-3 w-3" />
									{:else}
										<ChevronDown class="h-3 w-3" />
									{/if}
								{/if}
							</button>
						</th>
						<th
							class="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Handlinger
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each filteredUsers as user (user.id)}
						<tr class="transition-colors hover:bg-gray-50">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									<div class="h-10 w-10 flex-shrink-0">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100"
										>
											<span class="text-sm font-medium text-blue-600">
												{initials(user.name)}
											</span>
										</div>
									</div>
									<div class="ml-4">
										<div class="text-sm font-medium text-gray-900">{user.name}</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-600">{user.altEmail || user.email}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<Pill variant={user.role === 'board' ? 'purple' : 'blue'}>
									{user.role === 'board' ? 'Styret' : 'Frivillig'}
								</Pill>
							</td>
							<td class="px-6 py-4 text-right text-sm whitespace-nowrap">
								<a
									href="./admin/bruker/{user.id}"
									class="inline-flex items-center gap-2 font-medium text-blue-600 transition-colors hover:text-blue-900"
								>
									<Eye class="h-4 w-4" />
									Vis detaljer
								</a>
							</td>
						</tr>
					{/each}
					{#if filteredUsers.length === 0}
						<tr>
							<td colspan="4" class="px-6 py-12 text-center text-gray-500">
								<div class="flex flex-col items-center gap-4">
									<Users class="h-12 w-12 text-gray-300" />
									<div>
										<div class="text-lg font-medium text-gray-500">Ingen brukere funnet</div>
										{#if search}
											<div class="mt-1 text-sm text-gray-400">Prøv å endre søkekriteriene</div>
										{/if}
									</div>
								</div>
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
