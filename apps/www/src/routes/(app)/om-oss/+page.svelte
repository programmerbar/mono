<script lang="ts">
	import { echoUrlFor } from '$lib/api/sanity/image';
	import { Smile, Beer, Wine, Wifi, UserCircle } from 'lucide-svelte';
	import { marked } from 'marked';
	import Heading from '$lib/components/ui/Heading.svelte';

	let { data } = $props();

	const html = marked.parse(data.programmerbar.description);
</script>

<svelte:head>
	<title>Om oss</title>
</svelte:head>

<div class="max-w-screen-lg w-full mx-auto border-2 shadow-lg p-8 bg-background rounded-xl">
	<Heading class="text-4xl mb-4">Om oss</Heading>

	<div class="mb-16">
		<div
			class="mx-auto flex w-full mb-4 h-72 md:w-96 items-center justify-center gap-4 rounded-xl border-2 bg-gray-100 sm:float-right sm:ml-4"
		>
			<Smile class="h-16 w-16 text-primary" />
			<Beer class="h-16 w-16 text-primary" />
			<Wine class="h-16 w-16 text-primary" />
			<Wifi class="h-16 w-16 text-primary" />
		</div>

		<article class="text-xl prose-xl prose break-words">
			{@html html}
		</article>
	</div>

	<section>
		<Heading class="text-3xl" level={2}>Styremedlemmer</Heading>

		<ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-10 mt-4">
			{#each data.programmerbar.members as member}
				<li class="p-1 text-center">
					<div class="flex justify-center items-center mb-3">
						{#if member.profile.picture}
							<img
								src={echoUrlFor(member.profile.picture).width(200).height(200).url()}
								alt={member.profile.name}
								class="size-20 object-cover rounded-full border-2"
							/>
						{:else}
							<div
								class="size-20 bg-gray-200 rounded-full flex items-center justify-center border-2"
							>
								<UserCircle class="size-10 text-gray-400" />
							</div>
						{/if}
					</div>

					<h3 class="text-xl font-semibold">{member.profile.name}</h3>
					<p>{member.role}</p>
				</li>
			{/each}
		</ul>
	</section>
</div>
