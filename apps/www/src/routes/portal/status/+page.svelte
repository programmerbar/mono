<script lang="ts">
	import { Beer, Lock, Users, Loader } from 'lucide-svelte';
	import { cn } from '$lib/cn';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let isUpdating = $state(false);
	let newStatus = $state(data.status);

	const statusButtons = [
		{ status: 1, Icon: Beer, label: 'Åpnet', color: 'green-500' },
		{ status: 2, Icon: Users, label: 'Privat arrangement', color: 'orange-400' },
		{ status: 0, Icon: Lock, label: 'Stengt', color: 'red-500' }
	];
</script>

<div class="flex flex-col bg-background gap-2 max-w-[300px] mx-auto p-4 rounded-lg border">
	{#each statusButtons as { status, Icon, label, color }}
		{@const isSelected = data.status === status}
		<form
			method="post"
			use:enhance={() => {
				isUpdating = true;
				newStatus = status;

				return async ({ update }) => {
					await update();
					isUpdating = false;
				};
			}}
		>
			<input type="hidden" name="status" value={status} />
			<button
				class={cn(
					'w-full rounded-lg border p-4 bg-white hover:bg-gray-200 flex transition-colors items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60',
					{
						'bg-green-500 hover:bg-green-600': isSelected && status === 1,
						'bg-orange-400 hover:bg-orange-500': isSelected && status === 2,
						'bg-red-500 text-white hover:bg-red-600': isSelected && status === 0
					}
				)}
				disabled={isUpdating}
			>
				{#if isUpdating && newStatus === status}
					<Loader class="size-5 animate-spin" />
				{:else}
					<Icon class="size-5" />
				{/if}

				{label}
			</button>
		</form>
	{/each}
</div>
