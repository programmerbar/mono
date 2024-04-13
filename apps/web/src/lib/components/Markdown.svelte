<script lang="ts">
	import SvelteMarkdown, { type Renderers } from 'svelte-markdown';
	import Heading from './typography/Heading.svelte';

	type Props = {
		source: string;
	};

	const { source }: Props = $props();

	const renderers = {
		heading: Heading
	} satisfies Partial<Renderers>;
</script>

<SvelteMarkdown {source} {renderers} />
