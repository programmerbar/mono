<script lang="ts">
	import type { ResolvedPathname } from '$app/types';

	type Props = {
		to: ResolvedPathname | string;
		name: string;
	};

	let { to, name }: Props = $props();
</script>

<li class="font-mono">
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<a
		class="text-foreground-primary hover:text-primary text-xl font-semibold transition-colors hover:underline"
		href={to}>{name}</a
	>
</li>
