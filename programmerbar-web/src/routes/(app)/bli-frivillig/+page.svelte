<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ERROR_SEARCH_PARAM_ALREADY_REGISTERED } from '$lib/constants';
	import SEO from '$lib/components/SEO.svelte';
	import CLIWindow from '$lib/components/app/CLIWindow.svelte';

	let { form } = $props();

	let error = $derived(form?.error);
</script>

<SEO
	title="Bli frivillig"
	description="Bli frivillig i Programmerbar og få muligheten til å være med på å skape en fantastisk studentpub-miljø for informatikkstudenter. Få bonger for hver vakt og møt andre studenter."
	keywords="frivillig, volunteer, programmerbar, informatikkstudenter, studentpub, bonger, vakter"
	canonical="/bli-frivillig"
	type="website"
/>

<CLIWindow title="cat bli-frivillig.txt" class="mx-auto w-full max-w-[600px]">
	<!-- Window Content -->
	<div class="flex-1 space-y-8 p-6 md:p-8">
		<div class="space-y-4">
			<h1 class="text-foreground-primary text-center text-3xl font-bold">
				Bli frivillig i Programmerbar
			</h1>
			<p class="text-foreground-secondary">
				Som frivillig i Programmerbar får du mulighet til å være med på å skape en fantastisk
				studentpub-miljø for informatikkstudenter.
			</p>
		</div>
		<div class="space-y-4">
			<h2 class="text-foreground-primary text-xl font-semibold">## Hva får du som frivillig?</h2>
			<ul class="text-foreground-secondary list-inside list-disc space-y-2">
				<li>En bong for hver vakt du jobber</li>
				<li>Mulighet til å møte andre informatikkstudenter</li>
				<li>Erfaring med drift av studentpub</li>
				<li>Innblikk i hvordan en studentorganisasjon fungerer</li>
			</ul>
		</div>
		<div class="space-y-4">
			<h2 class="text-foreground-primary text-xl font-semibold">## Hva forventes av deg?</h2>
			<ul class="text-foreground-secondary list-inside list-disc space-y-2">
				<li>Jobbe minst en vakt i måneden</li>
				<li>Være ansvarlig og pålitelig</li>
				<li>Ha god tid til å møte opp på vakter du har meldt deg på</li>
			</ul>
		</div>
		{#if error}
			<div class="bg-card-muted border-accent-error border-l-4 p-4">
				<p class="text-accent-error text-sm font-semibold">error: {error}</p>
			</div>
		{/if}
		{#if page.url.searchParams.get('success') === 'true'}
			<div class="bg-card-muted border-accent-success border-l-4 p-4">
				<p class="text-accent-success text-sm font-semibold">
					success: Du er nå registrert som frivillig!
				</p>
			</div>
		{/if}
		{#if page.url.searchParams.get('error') === ERROR_SEARCH_PARAM_ALREADY_REGISTERED}
			<div class="bg-card-muted border-accent-error border-l-4 p-4">
				<p class="text-accent-error text-sm font-semibold">
					error: Du er allerede frivillig eller har sendt inn søknad.
				</p>
			</div>
		{/if}
		<a
			href={resolve('/bli-frivillig/no')}
			class="border-border bg-card-muted hover:bg-card-hover hover:border-primary text-foreground-primary inline-block w-full cursor-pointer border-2 px-4 py-3 text-center font-mono text-sm font-semibold transition-all"
		>
			Bli frivillig
		</a>
		<div class="text-center">
			<p class="text-foreground-secondary mb-2 text-sm">Har du allerede ein konto?</p>
			<a
				href={resolve('/auth/feide')}
				class="border-border bg-card-muted hover:bg-card-hover hover:border-primary text-foreground-primary inline-block w-fit cursor-pointer border-2 px-4 py-3 text-center font-mono text-sm font-semibold transition-all"
			>
				Logg inn
			</a>
		</div>
	</div>
</CLIWindow>
