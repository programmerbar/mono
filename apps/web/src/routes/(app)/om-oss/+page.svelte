<script lang="ts">
	import { echoUrlFor } from '$lib/data/sanity/image';
	import { initials } from '$lib/initials';
	import { Smile, Beer, Wine, Wifi } from 'lucide-svelte';

	let { data } = $props();
	let { programmerbar } = data;
</script>

<svelte:head>
	<title>Om oss — Programmerbar</title>
</svelte:head>

<div class="space-y-4 max-w-4xl mx-auto mb-10">
	<h1 class="text-4xl font-medium font-mono">Om oss</h1>

	<div
		class="h-72 w-96 flex gap-4 justify-center items-center border-2 rounded-xl bg-gray-100 sm:float-right mx-auto sm:ml-4"
	>
		<Smile class="w-16 h-16 text-primary" />
		<Beer class="w-16 h-16 text-primary" />
		<Wine class="w-16 h-16 text-primary" />
		<Wifi class="w-16 h-16 text-primary" />
	</div>

	<p class="text-lg text-gray-800">
		Programmerbar er en gjeng med studenter som jobber for å få bygget og drifte en bar for
		studentene på Informatikk! Vi stiller med mange forskjellige arrangementer i løpet av semesteret
		som fester, quizer, spillekvelder og bedriftspresentasjoner for å nevne noen. Vi tar alltid imot
		søkere til å bli frivillig, da er du frivillig semester for semester. I tiden fremover blir det
		mye fokus på å gjøre Programmerbar om til den soleklare plassen hvor alle informatikkstudenter
		samles.
	</p>

	<p class="text-lg text-gray-800">
		Neste byggeprosjekt er å vårt å få et eget lokale i det nye bygget på Nygårdshøyden sør.
	</p>

	<p class="text-lg text-gray-800">
		Programmerbar har ikke et fastsatt medlemstall, men rekrutterer nye medlemmer ved behov.
	</p>

	<h2 class="text-2xl font-medium text-gray-900">Kontakt:</h2>

	<p class="text-lg text-gray-800">
		Du kan ta kontakt med oss på epost: <a
			class="text-primary hover:underline"
			href="mailto:leder@pogramerbar.no"
		>
			leder@programmerbar.no
		</a>.
	</p>

	<h2 class="text-2xl font-medium text-gray-900">Medlemmer</h2>

	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
		{#each programmerbar.members as { profile, role }}
			<div class="bg-background rounded-xl shadow-xl border-2 p-4">
				<div class="flex flex-col gap-2">
					{#if profile.picture}
						<img
							src={echoUrlFor(profile.picture).height(800).width(800).url()}
							alt={profile.name}
							class="w-16 h-16 rounded-full border-2 border-border bg-gray-200 mx-auto"
						/>
					{:else}
						<div
							class="w-16 h-16 rounded-full border-2 border-border bg-gray-200 flex items-center justify-center font-mono text-xl mx-auto"
						>
							{initials(profile.name)}
						</div>
					{/if}
					<div class="text-center">
						<p class="text-xl font-medium">{profile.name}</p>
						<p class="text-sm font-medium font-mono text-gray-700">{role}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
