<script lang="ts">
	import { cn } from '$lib/cn';

	type Props = {
		status: number;
		message: string;
	};

	let { status, message }: Props = $props();
</script>

<div
	class={cn(
		'mx-auto flex w-fit items-center gap-3 rounded-2xl border-2 px-6 py-3 text-base font-semibold shadow-lg transition-all duration-300',
		{
			'border-red-200 bg-red-50 text-red-800 shadow-red-100': status === 0,
			'border-green-200 bg-green-50 text-green-800 shadow-green-100': status === 1,
			'border-orange-200 bg-orange-50 text-orange-800 shadow-orange-100': status === 2
		}
	)}
>
	<div
		class={cn('relative h-4 w-4 rounded-full shadow-lg', {
			'bg-red-500 shadow-red-300': status === 0,
			'bg-green-500 shadow-green-300': status === 1,
			'bg-orange-500 shadow-orange-300': status === 2
		})}
	>
		{#if status === 1}
			<div class="absolute inset-0 rounded-full bg-green-500 animate-pulse"></div>
		{/if}
		{#if status === 2}
			<div class="absolute inset-0 rounded-full bg-orange-500 animate-pulse"></div>
		{/if}
	</div>

	{message}
</div>
