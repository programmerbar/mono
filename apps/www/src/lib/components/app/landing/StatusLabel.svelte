<script lang="ts">
	import { cn } from '$lib/cn';

	type Props = {
		status: number;
		message: string;
	};

	let { status, message }: Props = $props();
</script>

<div
	class="bg-background mx-auto flex w-fit items-center gap-2 rounded-xl border px-4 py-1.5 text-sm font-medium shadow-md"
>
	<div
		class={cn('h-3 w-3 rounded-full shadow-lg', {
			'bg-red-500 shadow-red-500': status === 0,
			'bg-green-500 shadow-green-500': status === 1,
			'bg-yellow-500 shadow-yellow-500': status === 2
		})}
	></div>

	{message}
</div>
