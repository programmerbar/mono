<script lang="ts">
	import type { ResolvedPathname } from '$app/types';

	type Props = {
		to: ResolvedPathname | string;
		name: string;
	};

	let { to, name }: Props = $props();
</script>

<li class="hover:bg-card-hover flex w-full text-left font-mono transition-colors">
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<a
		class="text-foreground-primary hover:text-primary w-full px-4 py-2 text-3xl font-medium transition-colors hover:underline"
		href={to}
	>
		{name}
	</a>
</li>
