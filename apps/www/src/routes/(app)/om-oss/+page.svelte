<script lang="ts">
	import { echoUrlFor } from '$lib/api/sanity/image.js';
	import { Smile, Beer, Wine, Wifi, UserCircle } from 'lucide-svelte';
	import { marked } from 'marked';

	let { data } = $props();

	const html = marked.parse(data.programmerbar.description);
</script>

<div class="max-w-screen-lg w-full mx-auto border-2 shadow-lg p-8 bg-background rounded-xl">
	<h1 class="text-4xl font-semibold mb-4">Om oss</h1>

	<div
		class="mx-auto flex h-72 w-96 items-center justify-center gap-4 rounded-xl border-2 bg-gray-100 sm:float-right sm:ml-4"
	>
		<Smile class="h-16 w-16 text-primary" />
		<Beer class="h-16 w-16 text-primary" />
		<Wine class="h-16 w-16 text-primary" />
		<Wifi class="h-16 w-16 text-primary" />
	</div>

	<article class="text-xl prose-xl prose">
		{@html html}
	</article>

	<div>
		<h2 class="text-2xl font-semibold mt-8">Medlemmer</h2>

		<ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
			{#each data.programmerbar.members as member}
				<li class="border-2 p-4 rounded-xl text-center">
					<div class="flex justify-center items-center mb-3">
						{#if member.profile.picture}
							<img
								src={echoUrlFor(member.profile.picture).width(200).height(200).url()}
								alt={member.profile.name}
								class="w-24 h-24 object-cover rounded-full border-2"
							/>
						{:else}
							<div
								class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center border-2"
							>
								<UserCircle class="h-14 w-14 text-gray-400" />
							</div>
						{/if}
					</div>

					<h3 class="text-xl font-semibold">{member.profile.name}</h3>
					<p>{member.role}</p>
				</li>
			{/each}
		</ul>
	</div>
</div>
