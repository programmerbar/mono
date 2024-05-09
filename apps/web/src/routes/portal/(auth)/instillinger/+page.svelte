<script lang="ts">
	import { enhance } from '$app/forms';

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
			<button
				type="submit"
				class="h-10 px-4 rounded-lg border-2 bg-gray-200 hover:border-gray-300 transition-colors text-gray-700 font-medium"
			>
				Lagre
			</button>

			<button
				type="submit"
				formaction="?/clear"
				class="h-10 px-4 rounded-lg border-2 bg-red-200 hover:bg-red-300 transition-colors border-red-300 text-red-500 hover:text-red-700 font-medium"
			>
				Slett
			</button>
		</div>
	</form>

	<hr class="my-8" />

	<h2 class="text-xl font-medium mb-4">Bar-status</h2>

	<form action="?/open" method="post" use:enhance>
		<button
			type="submit"
			class="h-10 px-4 rounded-lg border-2 bg-gray-200 hover:border-gray-300 transition-colors text-gray-700 font-medium"
		>
			Åpne
		</button>
		<button
			type="submit"
			formaction="?/private"
			class="h-10 px-4 rounded-lg border-2 bg-yellow-200 hover:bg-yellow-300 transition-colors border-yellow-300 text-yellow-500 hover:text-yellow-700 font-medium"
		>
			Privat arrangement
		</button>
		<button
			type="submit"
			formaction="?/close"
			class="h-10 px-4 rounded-lg border-2 bg-red-200 hover:bg-red-300 transition-colors border-red-300 text-red-500 hover:text-red-700 font-medium"
		>
			Lukk
		</button>
	</form>
</main>
