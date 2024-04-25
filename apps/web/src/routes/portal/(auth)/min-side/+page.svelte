<script lang="ts">
	let { data } = $props();
</script>

<main class="max-w-screen-md">
	<h1 class="text-2xl font-medium mb-8">Min side</h1>

	<div>
		<h2 class="text-xl font-medium">Dine opplysninger</h2>
		<p class="mt-2">Navn: {data.user.name}</p>
		<p class="mt-2">E-post: {data.user.email}</p>
		<p class="mt-2">Type: {data.user.type}</p>
	</div>
</main>
