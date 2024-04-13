<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<div class="flex flex-col min-h-screen bg-[url('/circuit-board.svg')]">
	<Header />

	<div class="flex-1 max-w-7xl mx-auto w-full px-4">
		{@render children()}
	</div>

	<Footer />
</div>

