<script lang="ts">
	import { page } from '$app/state';
	import ButtonLink from '$lib/components/ui/ButtonLink.svelte';
	import { ERROR_SEARCH_PARAM_ALREADY_REGISTERED } from '$lib/constants';

	let { form } = $props();

	let error = $derived(form?.error);
</script>

<div class="bg-background mx-auto max-w-[600px] space-y-8 rounded-xl border-2 p-8">
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
	{#if page.url.searchParams.get('success') === 'true'}
		<div class="rounded-md bg-green-50 p-4 text-green-700">
			<p>Du er nå registrert som frivillig!</p>
		</div>
	{/if}
	{#if page.url.searchParams.get('error') === ERROR_SEARCH_PARAM_ALREADY_REGISTERED}
		<div class="rounded-md bg-red-50 p-4 text-red-700">
			<p>Du er allerede frivillig eller har sendt inn søknad.</p>
		</div>
	{/if}
	<ButtonLink intent="primary" href="/bli-frivillig/no">Bli frivillig med Feide</ButtonLink>
	<div class="text-center">
		<p class="mb-2">Har du allerede ein konto?</p>
		<ButtonLink class="mx-auto w-fit" href="/auth/feide">Logg inn</ButtonLink>
	</div>
</div>
