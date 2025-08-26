<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
</script>

<SEO title="Logg inn" description="Logg inn for å få tilgang til alle funksjoner" />

<div class="bg-background mx-auto max-w-[400px] rounded-xl border-2">
	<div class="p-4">
		<h1 class="mb-2 text-center text-2xl font-bold">Logg inn</h1>
		<p class="text-center text-sm text-gray-500">Logg inn for å få tilgang til alle funksjoner</p>
	</div>
	<div class="flex flex-col gap-2 p-4">
		<a
			class="rounded-lg border p-1 text-center font-medium transition-all hover:border-gray-300 hover:bg-gray-200"
			href="/auth/feide">Fortsett med Feide</a
		>
	</div>
</div>
