<script lang="ts">
	import StatusLabel from './StatusLabel.svelte';

	type Props = {
		status: number;
		message: string;
	};

	let { status, message }: Props = $props();
</script>

<div class="pb-56 pt-32 space-y-10">
	<StatusLabel {status} {message} />

	<h1 class="text-5xl md:text-6xl lg:text-7xl text-center font-mono text-gray-700">
		$ programmerbar
	</h1>

	<div class="w-fit mx-auto pt-8">
		<a
			href="/booking"
			class="rounded-lg border-2 font-medium text-lg text-gray-700 bg-gray-200 px-6 py-3 shadow transition-colors hover:bg-gray-300 hover:border-gray-400"
			>Klikk her for å booke!</a
		>
	</div>
</div>
