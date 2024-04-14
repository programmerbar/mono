<script lang="ts">
	import SvelteMarkdown, { type Renderers } from 'svelte-markdown';
	import Heading from './typography/Heading.svelte';
	import { cn } from '$lib/cn';
	import Text from './typography/Text.svelte';

	type Props = {
		source: string;
		class?: string;
	};

	const { source, class: className }: Props = $props();

	const renderers = {
		heading: Heading,
		paragraph: Text
	} satisfies Partial<Renderers>;
</script>

<article class={cn('max-w-screen-md w-full', className)}>
	<SvelteMarkdown {source} {renderers} />
</article>
