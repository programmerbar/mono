<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	let { form } = $props();

	let error = $derived(form?.error);
	let isSubmitting = $state(false);
</script>

<div class="mx-auto max-w-[600px] space-y-8 rounded-xl border-2 bg-background p-8">
	<div class="space-y-4">
		<h1 class="text-center text-3xl font-bold">Bli frivillig i Programmerbar</h1>
		<p class="text-center text-gray-600">
			Som frivillig i Programmerbar får du mulighet til å være med på å skape en fantastisk
			studentpub-miljø for informatikkstudenter.
		</p>
	</div>
	<div class="space-y-4">
		<h2 class="text-xl font-semibold">Hva får du som frivillig?</h2>
		<ul class="list-inside list-disc space-y-2 text-gray-600">
			<li>En bong for hver vakt du jobber</li>
			<li>Mulighet til å møte andre informatikkstudenter</li>
			<li>Erfaring med drift av studentpub</li>
			<li>Innblikk i hvordan en studentorganisasjon fungerer</li>
		</ul>
	</div>
	<div class="space-y-4">
		<h2 class="text-xl font-semibold">Hva forventes av deg?</h2>
		<ul class="list-inside list-disc space-y-2 text-gray-600">
			<li>Jobbe minst en vakt i måneden</li>
			<li>Være ansvarlig og pålitelig</li>
			<li>Ha god tid til å møte opp på vakter du har meldt deg på</li>
		</ul>
	</div>
	{#if error}
		<div class="rounded-md bg-red-50 p-4 text-red-700">
			<p>{error}</p>
		</div>
	{/if}
	<form
		method="post"
		class="space-y-4"
		use:enhance={() => {
			isSubmitting = true;

			return async ({ update, result }) => {
				await update();
				isSubmitting = false;

				if (result.type === 'error') {
					toast.error('Noe gikk galt. Vennligst prøv igjen senere.');
				} else {
					toast.success('Din søknad er mottatt!');
				}
			};
		}}
	>
		<div class="space-y-2">
			<label for="name" class="block text-sm font-medium">Navn</label>
			<input
				type="text"
				id="name"
				name="name"
				class="w-full rounded-lg border border-gray-300 p-2"
				placeholder="Ditt fulle navn"
				required
			/>
		</div>
		<div class="space-y-2">
			<label for="email" class="block text-sm font-medium">Student-e-post</label>
			<input
				type="email"
				id="email"
				name="email"
				class="w-full rounded-lg border border-gray-300 p-2"
				placeholder="fornavn.etternavn@student.uib.no"
				required
			/>
			<p class="text-xs text-gray-500">Du må bruke din student-e-post fra UiB</p>
		</div>
		<button
			type="submit"
			disabled={isSubmitting}
			class="w-full rounded-lg border-2 border-primary bg-primary p-4 text-center text-lg font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-70"
		>
			{isSubmitting ? 'Sender...' : 'Send søknad'}
		</button>
	</form>
	<div class="text-center">
		<p class="mb-2">Har du allerede ein konto?</p>
		<a
			href="/auth/feide"
			class="inline-block rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-dark"
			>Logg inn</a
		>
	</div>
</div>
