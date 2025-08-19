<script lang="ts">
	import { cn } from '$lib/cn';
	import { SvelteSet } from 'svelte/reactivity';

	type OptionType = string | { id: string; label: string };

	type Props = {
		options: OptionType[];
		selected: SvelteSet<string>;
		onToggle: (option: string) => void;
		placeholder?: string;
		label?: string;
	};

	let { options, selected, onToggle, placeholder = 'Select options...', label }: Props = $props();

	let isOpen = $state(false);
	let container: HTMLDivElement | undefined = $state();

	function handleClickOutside(event: MouseEvent) {
		if (container && !container.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});

	function handleToggle(option: OptionType) {
		const id = typeof option === 'string' ? option : option.id;
		onToggle(id);
	}

	function getOptionId(option: OptionType): string {
		return typeof option === 'string' ? option : option.id;
	}

	function getOptionLabel(option: OptionType): string {
		return typeof option === 'string' ? option : option.label;
	}

	function getDisplayText() {
		if (selected.size === 0) {
			return placeholder;
		}
		if (selected.size === 1) {
			const selectedId = Array.from(selected)[0];
			const selectedOption = options.find((opt) => getOptionId(opt) === selectedId);
			return selectedOption ? getOptionLabel(selectedOption) : selectedId;
		}
		return `${selected.size} valgt`;
	}
</script>

<div class="relative" bind:this={container}>
	{#if label}
		<span class="mb-1 block text-sm font-semibold">{label}</span>
	{/if}

	<button
		type="button"
		class={cn(
			'border-border flex h-10 w-full items-center justify-between rounded-lg border-2 bg-white px-2 py-1 text-left text-sm',
			{
				'text-gray-500': selected.size === 0
			}
		)}
		onclick={() => (isOpen = !isOpen)}
	>
		<span>{getDisplayText()}</span>
		<svg
			class={cn('h-4 w-4 transition-transform', {
				'rotate-180': isOpen
			})}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if isOpen}
		<div
			class="border-border absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border-2 bg-white shadow-lg"
		>
			{#each options as option (getOptionId(option))}
				<label class="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-50">
					<input
						type="checkbox"
						checked={selected.has(getOptionId(option))}
						onchange={() => handleToggle(option)}
						class="rounded"
					/>
					<span class="text-sm">{getOptionLabel(option)}</span>
				</label>
			{/each}
		</div>
	{/if}
</div>
