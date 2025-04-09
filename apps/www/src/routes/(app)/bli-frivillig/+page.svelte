<script lang="ts">
	import { toast } from 'svelte-sonner';

	let name = $state('');
	let email = $state('');
	let isSubmitting = $state(false);
	let error = $state('');

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!name || !email) {
			error = 'Vennligst fyll ut både navn og e-post';
			return;
		}

		if (!email.endsWith('@student.uib.no')) {
			error = 'E-post må være en student-e-post (@student.uib.no)';
			return;
		}

		isSubmitting = true;
		error = '';

		try {
			const response = await fetch('/api/volunteer-request', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name, email })
			});

			const responseData = await response.json();

			if (response.ok) {
				toast.success('Din søknad er mottatt!');
				name = '';
				email = '';
			} else {
				error = responseData.error || 'Noe gikk galt. Vennligst prøv igjen senere.';
			}
		} catch (err) {
			console.error('Error submitting volunteer request:', err);
			error = 'Noe gikk galt. Vennligst prøv igjen senere.';
		} finally {
			isSubmitting = false;
		}
	}
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
			<li>Være ansvarlig og p�litelig</li>
			<li>Ha god tid til å møte opp på vakter du har meldt deg på</li>
		</ul>
	</div>
	{#if error}
		<div class="rounded-md bg-red-50 p-4 text-red-700">
			<p>{error}</p>
		</div>
	{/if}
	<form onsubmit={handleSubmit} class="space-y-4">
		<div class="space-y-2">
			<label for="name" class="block text-sm font-medium">Navn</label>
			<input
				type="text"
				id="name"
				bind:value={name}
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
				bind:value={email}
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
</div>
