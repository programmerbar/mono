<script lang="ts">
	import { Beer, Lock, Users } from 'lucide-svelte';
	import { cn } from '$lib/cn';
	import { enhance } from '$app/forms';

	let { data } = $props();

	const statusButtons = [
		{ status: 1, Icon: Beer, label: 'Åpnet', color: 'green-500' },
		{ status: 2, Icon: Users, label: 'Privat arrangement', color: 'orange-400' },
		{ status: 0, Icon: Lock, label: 'Stengt', color: 'red-500' }
	];
</script>

<div class="flex flex-col bg-background gap-2 max-w-[300px] mx-auto p-4 rounded-lg border">
	{#each statusButtons as { status, Icon, label, color }}
		{@const isSelected = data.status === status}
		<form method="post" use:enhance>
			<input type="hidden" name="status" value={status} />
			<button
				class={cn('w-full rounded-lg border p-4 bg-white flex items-center justify-center gap-2', {
					['bg-' + color]: isSelected,
					'text-white': isSelected && status === 0
				})}
			>
				<Icon class="size-5" />
				{label}
			</button>
		</form>
	{/each}
</div>
