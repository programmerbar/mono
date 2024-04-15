<script lang="ts">
	import { cn } from '$lib/cn';
	import type { Snippet } from 'svelte';

	type Props = {
		status: number;
		children: Snippet;
	};

	const { status, children }: Props = $props();
</script>

<div
	class="bg-background font-medium text-sm flex items-center gap-2 rounded-xl shadow-md px-4 py-1.5 border w-fit mx-auto"
>
	<div
		class={cn('w-3 h-3 rounded-full shadow-lg', {
			'bg-red-500 shadow-red-500': status === 0,
			'bg-green-500 shadow-green-500': status === 1,
			'bg-yellow-500 shadow-yellow-500': status === 2
		})}
	/>

	{@render children()}
</div>
