<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { resolve } from '$app/paths';
	import CLIWindow from '$lib/components/app/CLIWindow.svelte';
</script>

<SEO title="Logg inn" description="Logg inn for å få tilgang til alle funksjoner" />

<CLIWindow title="cat logg-inn.txt" class="mx-auto max-w-md">
	<!-- Window Content -->
	<div class="p-6">
		<h2 class="text-foreground-primary mb-2 text-2xl font-semibold">
			<span class="text-foreground-muted">##</span> Logg inn
		</h2>
		<p class="text-foreground-muted mb-6 text-sm">
			Du må være en frivillig i Programmerbar for å logge inn.
		</p>
		<div class="flex flex-col gap-2">
			<a
				class="border-border bg-card-muted hover:bg-card-hover hover:border-primary text-foreground-primary border-2 px-4 py-3 text-center font-mono text-sm font-semibold transition-all"
				href={resolve('/auth/feide')}
			>
				Fortsett med Feide
			</a>
		</div>
	</div>
</CLIWindow>
