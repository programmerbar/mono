<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/portal/Button.svelte';

	let { data } = $props();
</script>

<main class="flex flex-col max-w-screen-md w-full gap-4">
	<h1 class="text-2xl font-medium mb-8">Innstillinger</h1>

	<h2 class="text-xl font-medium mb-4">Nettside-banner</h2>

	<form action="?/setBanner" method="post" class="space-y-4" use:enhance>
		<div>
			<label for="banner" class="text-sm font-medium">Banner</label>
			<input
				type="text"
				id="banner"
				name="banner"
				class="w-full border rounded-lg form-input bg-background h-10 border-gray-200"
				value={data.banner}
			/>
		</div>

		<div class="mt-4">
			<Button intent="primary" type="submit">Lagre</Button>

			<Button type="submit" formaction="?/clear" intent="danger">Slett</Button>
		</div>
	</form>

	<hr class="my-8" />

	<h2 class="text-xl font-medium mb-4">Bar-status</h2>

	<form action="?/open" method="post" use:enhance>
		<Button type="submit" intent="primary">Åpne</Button>
		<Button type="submit" formaction="?/private" intent="warning">Privat arrangement</Button>
		<Button type="submit" formaction="?/close" intent="danger">Lukk</Button>
	</form>
</main>
