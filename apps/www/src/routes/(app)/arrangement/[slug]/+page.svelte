<script lang="ts">
	import { formatDate } from '$lib/date';
	import { marked } from 'marked';

	let { data } = $props();

	let html = marked.parse(data.event.body ?? '');
</script>

<svelte:head>
	<title>{data.event.title}</title>
	<meta property="og:title" content={data.event.title} />
	<meta property="og:type" content="article" />
	<meta property="og:locale" content="nb_NO" />
</svelte:head>

<main class="flex flex-col-reverse gap-8 md:flex-row">
	<div class="bg-background h-fit w-full rounded-xl border-2 p-6 shadow-xl">
		<article class="prose md:prose-lg prose-h1:text-3xl md:prose-h1:text-4xl font-sans">
			<h1>{data.event.title}</h1>

			{@html html}
		</article>
	</div>

	<aside class="w-full space-y-4 md:max-w-[350px]">
		<div class="bg-background h-fit rounded-xl border-2 p-6 shadow-xl">
			<ul class="space-y-8">
				<li>
					<h3 class="font-mono text-lg font-medium">Når?:</h3>
					<p>{formatDate(data.event.date)}</p>
				</li>

				{#if data.event.registrationStart}
					<li>
						<a href="https://echo.uib.no/arrangement/{data.event.slug}">Link til påmelding</a>
					</li>
				{/if}
			</ul>
		</div>
	</aside>
</main>
