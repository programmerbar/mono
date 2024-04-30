<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ProfilePreview from '$lib/components/ProfilePreview.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data } = $props();

	let search = $state($page.url.searchParams.get('q') || '');

	$effect(() => {
		const params = new URLSearchParams();
		if (search) params.set('q', encodeURIComponent(search));
		if (!search) params.delete('q');

		goto(`?${params.toString()}`, { keepFocus: true });
	});

	let filteredUsers = $derived(
		data.users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
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

	<ul class="grid gird-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each filteredUsers as user}
			{@const isUser = user.id === data.user.id}
			<li>
				<ProfilePreview id={user.id} name={user.name} email={user.email} {isUser} />
			</li>
		{:else}
			<li>
				<p class="text-xl text-gray-600">Fant ingen brukere</p>
			</li>
		{/each}
	</ul>
</main>
