<script lang="ts">
	import Header from '$lib/components/portal/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	let { data, children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<div class="bg-background sticky top-0 z-10">
		<div class="mx-auto max-w-screen-lg px-4">
			<Header notifications={data.notifications} />
		</div>
	</div>
	<div class="flex-1 px-4 py-10">
		<div class="mx-auto max-w-screen-lg">
			{@render children()}
		</div>
	</div>
	<Footer />
</div>
