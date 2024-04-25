<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';

	let { data } = $props();
</script>

<SEO title="Brukere" />

<main class="flex flex-col max-w-screen-md w-full">
	<h1 class="text-2xl font-medium mb-8">Brukere</h1>

	<ul>
		{#each data.users as user}
			<li>
				<div class="p-4 rounded-lg border">
					<h2 class="text-xl font-medium">{user.name}</h2>
					<p class="mt-2">E-post: {user.email}</p>
					<p class="mt-2">
						Type:
						{#if user.type === 'admin'}
							<span class="text-red-500">Admin</span>
						{:else}
							<span class="text-green-500">Bruker</span>
						{/if}
					</p>
				</div>
			</li>
		{/each}
	</ul>
</main>
