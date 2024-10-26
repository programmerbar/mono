<script lang="ts">
	import { mailto } from '$lib/prefix';
	import { initials } from '$lib/initials';

	let { data } = $props();

	let search = $state('');

	let filteredUsers = $derived.by(() =>
		data.users.filter((user) => {
			return user.name.toLowerCase().includes(search.toLowerCase());
		})
	);
</script>

<h1 class="text-2xl font-medium mb-4">Brukere</h1>

<div class="mb-4">
	<input
		type="search"
		class="w-full border border-border rounded-lg h-8 px-4"
		placeholder="Søk etter bruker"
		bind:value={search}
	/>
</div>

<ul class="grid grid-cols-1 md:grid-cols-3 gap-4">
	{#each filteredUsers as user}
		<li class="block bg-gray-100 border rounded-lg p-4">
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
