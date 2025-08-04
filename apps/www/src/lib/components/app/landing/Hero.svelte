<script lang="ts">
	import StatusLabel from './StatusLabel.svelte';

	type Props = {
		status: number;
		message: string;
	};

	let { status, message }: Props = $props();
</script>

<div class="space-y-10 pt-32 pb-56">
	<StatusLabel {status} {message} />

	<h1 class="text-center font-mono text-4xl text-gray-700 sm:text-5xl md:text-6xl lg:text-7xl">
		$ programmerbar
	</h1>

	<div class="mx-auto w-fit pt-8">
		<a
			href="https://forms.gle/BLdygdoRJgjMbQZj6"
			class="rounded-lg border-2 bg-gray-200 px-6 py-3 text-lg font-medium text-gray-700 shadow transition-colors hover:border-gray-400 hover:bg-gray-300"
			>Klikk her for å booke!</a
		>
	</div>
</div>
