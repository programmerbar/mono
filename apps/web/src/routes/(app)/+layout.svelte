<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { setContext } from 'svelte';

	let { children, data } = $props();

	setContext('banner', data.banner);
</script>

<div class="flex flex-col min-h-screen bg-[url('/circuit-board.svg')]">
	{#if data.banner}
		<div class="bg-primary text-white z-50 font-medium text-sm top-0 sticky text-center py-2">
			<p>
				{data.banner}
			</p>
		</div>
	{/if}

	<Header />

	<div class="flex-1 max-w-7xl mx-auto w-full px-4">
		{@render children()}
	</div>

	<Footer />
</div>
