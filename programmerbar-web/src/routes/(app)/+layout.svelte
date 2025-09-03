<script lang="ts">
	import Footer from '$lib/components/app/Footer.svelte';
	import Header from '$lib/components/app/header/Header.svelte';
	import StatusBanner from '$lib/components/app/landing/StatusBanner.svelte';

	let { children } = $props();
</script>

<StatusBanner />

<div class="flex min-h-screen flex-col bg-[url('/circuit-board.svg')] bg-[length:400px]">
	<Header />

	<div class="mx-auto w-full max-w-7xl flex-1 px-4">
		{@render children()}
	</div>

	<Footer />
</div>
