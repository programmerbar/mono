<script lang="ts">
	import { navigating } from '$app/stores';
	import { tweened } from 'svelte/motion';

	let showProgressBar = $state(false);
	let progress = tweened(0, { duration: 200 });
	let interval: ReturnType<typeof setInterval> | undefined;

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
	<div class="animate-loader fixed left-0 top-0 h-1 bg-primary" style="width: {$progress}%"></div>
{/if}

<style>
	.animate-loader {
		transition: width 0.2s ease-out;
	}
</style>
