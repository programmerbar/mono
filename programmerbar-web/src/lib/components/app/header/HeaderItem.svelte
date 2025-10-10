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
	<a class="text-xl font-semibold text-gray-700 hover:underline" href={to}>{name}</a>
</li>
