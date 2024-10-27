<script lang="ts">
	import { navigating } from '$app/stores';
	import { tweened } from 'svelte/motion';

	let showProgressBar = $state(false);
	let progress = tweened(0, { duration: 200 });
	let interval: NodeJS.Timeout | undefined;

	$effect(() => {
		if ($navigating) {
			progress.set(0).then(() => {
				showProgressBar = true;
				interval = setInterval(() => {
					progress.update((n) => Math.min(n + 1, 90));
				}, 50);
			});
		} else {
			progress.set(100, { duration: 50 }).then(() => {
				setTimeout(() => {
					showProgressBar = false;
				}, 100);
			});
			clearInterval(interval);
		}

		return () => clearInterval(interval);
	});
</script>

{#if showProgressBar}
	<div class="fixed top-0 left-0 h-1 bg-primary animate-loader" style="width: {$progress}%"></div>
{/if}

<style>
	.animate-loader {
		transition: width 0.2s ease-out;
	}
</style>
