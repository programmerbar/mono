<script lang="ts">
	import type { ResolvedPathname } from '$app/types';

	type Props = {
		to: ResolvedPathname | string;
		name: string;
	};

	let { to, name }: Props = $props();
</script>

<li class="flex w-full text-left font-mono hover:bg-gray-100">
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<a class="w-full px-4 py-2 text-3xl font-medium text-gray-700 hover:underline" href={to}>
		{name}
	</a>
</li>
