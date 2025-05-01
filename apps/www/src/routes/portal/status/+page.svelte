<script lang="ts">
	import { Beer, Lock, Users, Loader } from '@lucide/svelte';
	import { cn } from '$lib/cn';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let isUpdating = $state(false);
	let newStatus = $state(data.status);

	const statusButtons = [
		{ status: 1, Icon: Beer, label: 'Åpnet' },
		{ status: 2, Icon: Users, label: 'Privat arrangement' },
		{ status: 0, Icon: Lock, label: 'Stengt' }
	];
</script>

<svelte:head>
	<title>Endre status</title>
</svelte:head>

<div class="mx-auto flex max-w-[300px] flex-col gap-2 rounded-lg border bg-background p-4">
	{#each statusButtons as { status, Icon, label }}
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
					'flex w-full items-center justify-center gap-2 rounded-lg border bg-white p-4 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60',
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
