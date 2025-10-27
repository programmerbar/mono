<script lang="ts">
	import { getThemeContext } from '$lib/states/theme.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		open: boolean;
		maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
		children?: Snippet;
	};

	let { open, maxWidth = 'md', children }: Props = $props();

	const maxWidthClasses = {
		sm: 'max-w-md',
		md: 'max-w-xl',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl'
	};

	let theme = getThemeContext();
	let darkClass = $derived(theme?.isDark ? 'dark' : '');
</script>

{#if open}
	<div
		class="modal-content relative z-10 flex max-h-[90svh] w-full flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.35)] dark:border dark:border-[#2a2a2a] dark:bg-[#0f0f0f] {maxWidthClasses[
			maxWidth
		]} {darkClass}"
	>
		{@render children?.()}
	</div>
{/if}

<style>
	/* For simple modals without body component */
	.modal-content:not(:has(.modal-body)) {
		overflow-y: auto;
	}
</style>
