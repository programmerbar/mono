<script lang="ts">
	import { type Product } from '$lib/types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let history = $state<Array<string>>([]);
	let command = $state<string>('');

	const handleCommand = async (command: string) => {
		history.push(command);

		if (command === 'clear') {
			history = [];
			return;
		}

		if (command === 'exit') {
			await goto('/');
			return;
		}

		if (command === 'menu') {
			const products = await fetch('/products')
				.then((res) => res.json())
				.then((data) => data as Array<Product>);
			for (const product of products) {
				history.push(`${product.name} - ${product.price} kr`);
			}

			return;
		}

		if (command === 'help') {
			history.push('Available commands:');
			history.push('  - menu: Show the menu');
			history.push('  - exit: Return to the home page');
			history.push('  - clear: Clear the terminal');
			history.push('  - help: Show this help message');
			return;
		}

		history.push(`Command not found: ${command}`);
	};

	const onkeydown = async (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			await handleCommand(command);
			command = '';
		}
	};
</script>

<div
	class="bg-black font-mono text-green-400 flex flex-col items-center justify-center min-h-screen"
>
	<div class="py-8">
		<h1 class="text-center text-3xl">Noe gikk galt: {$page.status}</h1>

		{#if $page.error?.message}
			<p class="text-center text-lg">{$page.error.message}</p>
		{/if}
	</div>

	<div
		class="border border-gray-800 p-2 max-h-[600px] max-w-screen-sm w-full h-full flex-1 flex flex-col overflow-y-scroll hide-scrollbar"
	>
		<div class="flex-1" />
		{#each history as item}
			<div>{item}</div>
		{/each}
		<div class="flex items-center gap-2">
			<span>$</span>
			<input
				type="text"
				class="bg-transparent w-full outline-0 border-0 active:outline-0 focus:outline-0 text-green-400 active:border-0 focus:border-0 focus-within:border-0 focus-within:outline-0"
				bind:value={command}
				{onkeydown}
			/>
		</div>
	</div>
</div>

<style>
	.hide-scrollbar {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
</style>
