<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { mailTo } from '$lib/utils/prefixes.js';
	import type { User } from 'lucia';
	import { User2 } from 'lucide-svelte';

	let { data } = $props();

	let search = $state('');

	let filteredUsers = data.users.filter((user) =>
		user.name.toLowerCase().includes(search.toLowerCase())
	);
</script>

<SEO title="Brukere" />

<main class="flex flex-col max-w-screen-md w-full gap-4">
	<h1 class="text-2xl font-medium mb-8">Frivillige</h1>

	<div>
		<input
			type="text"
			placeholder="Søk etter bruker"
			class="w-full border rounded-lg form-input bg-background h-10 border-gray-200"
			bind:value={search}
		/>
	</div>

	<ul class="grid gird-cols-1 md:grid-cols-3 gap-4">
		{#each filteredUsers as user}
			{@const isUser = user.id === data.user.id}
			<li>
				<div class="p-4 rounded-lg border h-full space-y-2">
					<div
						class="h-20 w-20 rounded-full bg-gray-200 mx-auto border-2 border-gray-400 flex flex-col items-center justify-center"
					>
						<User2 class="h-10 w-10 text-gray-500" />
					</div>

					<h2 class="text-xl font-medium text-center">
						{user.name}
						{#if isUser}
							<span class="text-xs text-gray-500">(deg)</span>
						{/if}
					</h2>

					<p class="text-center">
						<a class="hover:underline text-blue-500" href={mailTo(user.email)}>{user.email}</a>
					</p>
				</div>
			</li>
		{/each}
	</ul>
</main>
