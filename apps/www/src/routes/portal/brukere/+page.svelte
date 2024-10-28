<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import { mailto, initials } from '$lib/utils';
	import Input from '$lib/components/ui/Input.svelte';

	let { data } = $props();

	let search = $state('');

	let filteredUsers = $derived.by(() =>
		data.users.filter((user) => {
			return user.name.toLowerCase().includes(search.toLowerCase());
		})
	);
</script>

<Heading class="mb-4">Brukere</Heading>

<Input type="search" class="mb-4 w-full" placeholder="Søk etter bruker" bind:value={search} />

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
