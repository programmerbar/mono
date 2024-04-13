<script lang="ts">
	import Markdown from '$lib/components/Markdown.svelte';
	import { formatDate } from '$lib/utils/date.js';

	const { data } = $props();
</script>

<svelte:head>
	<title>{data.event.title}</title>
</svelte:head>

<main class="space-y-8">
	<div class="flex items-center justify-between p-4 border bg-gray-200 text-gray-800">
		<div>
			<p>Start: {formatDate(data.event.start)}</p>
		</div>
		<div>
			<p>Slutt: {formatDate(data.event.start)}</p>
		</div>
	</div>

	<article>
		<Markdown source={data.event.body} />
	</article>
</main>
