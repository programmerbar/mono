<script lang="ts">
	import Footer from '$lib/components/footer/Footer.svelte';
	import Header from '$lib/components/app/header/Header.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col bg-[url('/circuit-board.svg')] bg-[length:400px]">
	<Header />

	<div class="mx-auto w-full max-w-7xl flex-1 px-4">
		{@render children()}
	</div>

	<Footer />
</div>
