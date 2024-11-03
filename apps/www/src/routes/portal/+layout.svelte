<script lang="ts">
	import Header from '$lib/components/portal/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Header />

	<div class="flex-1 px-4 py-10">
		<div class="mx-auto max-w-screen-md">
			{@render children()}
		</div>
	</div>

	<Footer />
</div>
