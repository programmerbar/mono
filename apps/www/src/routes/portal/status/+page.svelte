<script lang="ts">
	import { Beer, Lock, Users, Loader } from '@lucide/svelte';
	import { cn } from '$lib/cn';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let isUpdating = $state(false);
	let newStatus = $state(data.status);

	const statusButtons = [
		{ 
			status: 1, 
			Icon: Beer, 
			label: 'Åpnet',
			description: 'Baren er åpen for alle studenter',
			color: 'green'
		},
		{ 
			status: 2, 
			Icon: Users, 
			label: 'Privat arrangement',
			description: 'Privat event eller lukket arrangement',
			color: 'orange'
		},
		{ 
			status: 0, 
			Icon: Lock, 
			label: 'Stengt',
			description: 'Baren er stengt for i dag',
			color: 'red'
		}
	];
</script>

<svelte:head>
	<title>Endre status</title>
</svelte:head>

<div class="mx-auto max-w-md space-y-4">
	<div class="text-center">
		<h1 class="text-2xl font-bold text-gray-800 mb-2">Barstatus</h1>
		<p class="text-gray-600">Velg gjeldende status for baren</p>
	</div>
	
	<div class="space-y-3">
		{#each statusButtons as { status, Icon, label, description, color } (status)}
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
						'w-full rounded-2xl border-2 bg-white p-6 transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60',
						{
							'border-green-200 bg-green-50 shadow-green-100 hover:border-green-300 hover:shadow-green-200': isSelected && color === 'green',
							'border-orange-200 bg-orange-50 shadow-orange-100 hover:border-orange-300 hover:shadow-orange-200': isSelected && color === 'orange',
							'border-red-200 bg-red-50 shadow-red-100 hover:border-red-300 hover:shadow-red-200': isSelected && color === 'red',
							'border-gray-200 hover:border-gray-300 hover:bg-gray-50': !isSelected
						}
					)}
					disabled={isUpdating}
				>
					<div class="flex items-center gap-4">
						<div class={cn(
							'flex h-12 w-12 items-center justify-center rounded-xl',
							{
								'bg-green-500 text-white': isSelected && color === 'green',
								'bg-orange-500 text-white': isSelected && color === 'orange', 
								'bg-red-500 text-white': isSelected && color === 'red',
								'bg-gray-100 text-gray-600': !isSelected
							}
						)}>
							{#if isUpdating && newStatus === status}
								<Loader class="h-6 w-6 animate-spin" />
							{:else}
								<Icon class="h-6 w-6" />
							{/if}
						</div>
						
						<div class="flex-1 text-left">
							<h3 class={cn(
								'text-lg font-semibold',
								{
									'text-green-800': isSelected && color === 'green',
									'text-orange-800': isSelected && color === 'orange',
									'text-red-800': isSelected && color === 'red',
									'text-gray-800': !isSelected
								}
							)}>
								{label}
							</h3>
							<p class={cn(
								'text-sm',
								{
									'text-green-600': isSelected && color === 'green',
									'text-orange-600': isSelected && color === 'orange',
									'text-red-600': isSelected && color === 'red',
									'text-gray-500': !isSelected
								}
							)}>
								{description}
							</p>
						</div>
						
						{#if isSelected}
							<div class={cn(
								'h-3 w-3 rounded-full',
								{
									'bg-green-500': color === 'green',
									'bg-orange-500': color === 'orange',
									'bg-red-500': color === 'red'
								}
							)}></div>
						{/if}
					</div>
				</button>
			</form>
		{/each}
	</div>
</div>
