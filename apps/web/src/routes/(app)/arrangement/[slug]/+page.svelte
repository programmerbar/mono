<script lang="ts">
	import Markdown from '$lib/components/Markdown.svelte';
	import Sidebar from './Sidebar.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>{data.event.title} — Programmerbar</title>
</svelte:head>

<main class="flex gap-24 md:gap-8 flex-col md:flex-row">
	<Markdown
		class="p-6 bg-background rounded-xl border-2 h-fit shadow-xl"
		source={data.event.body}
	/>
	<Sidebar event={data.event} />
</main>
