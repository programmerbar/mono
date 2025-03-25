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

<div class="mx-auto w-full max-w-screen-lg rounded-xl border-2 bg-background p-8 shadow-lg">
	<Heading class="mb-4 text-4xl">Om oss</Heading>

	<div class="mb-16">
		<div
			class="mx-auto mb-4 flex h-72 w-full items-center justify-center gap-4 rounded-xl border-2 bg-gray-100 sm:float-right sm:ml-4 md:w-96"
		>

			{#if data.programmerbar.image}
				<img
						src={echoUrlFor(data.programmerbar.image).url()}
						alt={"Programmerbar"}
						class="h-full w-full object-cover rounded-xl"

				/>
			{:else}
				<Smile class="h-16 w-16 text-primary" />
				<Beer class="h-16 w-16 text-primary" />
				<Wine class="h-16 w-16 text-primary" />
				<Wifi class="h-16 w-16 text-primary" />
			{/if}
		</div>

		<article class="prose prose-xl break-words text-xl">
			{@html html}
		</article>
	</div>

	<section>
		<Heading class="text-3xl" level={2}>Styremedlemmer</Heading>

		<ul class="mt-4 grid grid-cols-1 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
			{#each data.programmerbar.members as member}
				<li class="p-1 text-center">
					<div class="mb-3 flex items-center justify-center">
						{#if member.profile.picture}
							<img
								src={echoUrlFor(member.profile.picture).width(200).height(200).url()}
								alt={member.profile.name}
								class="size-20 rounded-full border-2 object-cover"
							/>
						{:else}
							<div
								class="flex size-20 items-center justify-center rounded-full border-2 bg-gray-200"
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
