<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let { data } = $props();
</script>

<SEO title="Min side" />

<main class="max-w-screen-md">
	<h1 class="text-2xl font-medium mb-8">Min side</h1>

	<div>
		<h2 class="text-xl font-medium">Dine opplysninger</h2>

		<form
			method="post"
			class="space-y-4"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						toast.success('Opplysningene ble lagret!');
						invalidateAll();
					} else {
						toast.error('Noe gikk galt. Prøv igjen senere.');
					}
					await applyAction(result);
				};
			}}
		>
			<div>
				<label for="name" class="text-sm font-medium">Navn</label>
				<input
					type="text"
					id="name"
					name="name"
					class="w-full border rounded-lg form-input bg-background h-10 border-gray-200"
					value={data.user.name}
				/>
			</div>

			<div>
				<label for="email" class="text-sm font-medium">E-post</label>
				<input
					type="email"
					id="email"
					name="email"
					class="w-full border rounded-lg form-input bg-background h-10 border-gray-200"
					value={data.user.email}
				/>
			</div>

			<button
				type="submit"
				class="mt-4 h-10 px-4 rounded-lg border hover:bg-gray-200 hover:border-gray-300 transition-colors text-gray-700 font-medium"
			>
				Lagre
			</button>
		</form>
	</div>
</main>
