<script lang="ts">
	import Header from '$lib/components/portal/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';

	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
	<Header />

	<div class="flex-1 py-10 px-4">
		<div class="max-w-screen-md mx-auto">
			{@render children()}
		</div>
	</div>

	<Footer />
</div>
