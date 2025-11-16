<script lang="ts">
	import CLIWindow from '$lib/components/app/CLIWindow.svelte';
</script>

<CLIWindow title="find programmerbar" class="min-h-[400px] lg:h-full lg:min-h-0">
	<!-- Window Content -->
	<div class="flex-1 overflow-hidden">
		<iframe
			title="Programmerbar"
			width="100%"
			height="100%"
			class="h-full w-full"
			src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Programmerbar,%20Thorm%C3%B8hlens%20Gate%2055,%205006%20Bergen+(Programmerbar)&t=&z=17&ie=UTF8&iwloc=B&output=embed"
		></iframe>
	</div>
</CLIWindow>
