<script lang="ts">
	import { cn } from '$lib/utils/cn';

	export type OptionType = string | { id: string; label: string };

	type Props = {
		options: Array<OptionType>;
		selected: Array<string>;
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
		if (selected.length === 0) {
			return placeholder;
		}
		if (selected.length === 1) {
			const selectedId = Array.from(selected)[0];
			const selectedOption = options.find((opt) => getOptionId(opt) === selectedId);
			return selectedOption ? getOptionLabel(selectedOption) : selectedId;
		}
		return `${selected.length} valgt`;
	}
</script>

<div class="relative flex flex-col gap-1" bind:this={container}>
	{#if label}
		<span class="text-foreground-secondary text-xs font-medium">{label}</span>
	{/if}

	<button
		type="button"
		class={cn(
			'border-border bg-card-muted focus:border-primary flex h-10 w-full items-center justify-between border px-2 py-1.5 text-left font-mono text-sm focus:ring-0 focus:outline-none',
			{
				'text-foreground-muted': selected.length === 0,
				'text-foreground-secondary': selected.length > 0
			}
		)}
		onclick={() => (isOpen = !isOpen)}
	>
		<span>{getDisplayText()}</span>
		<svg
			class={cn('text-foreground-muted h-4 w-4 transition-transform', {
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
			class="border-border bg-card absolute top-full z-10 mt-1 max-h-60 w-full overflow-y-auto border font-mono"
		>
			{#each options as option (getOptionId(option))}
				<label
					class="border-border hover:bg-card-muted flex cursor-pointer items-center gap-2 border-b px-3 py-2 last:border-b-0"
				>
					<input
						type="checkbox"
						checked={selected.includes(getOptionId(option))}
						onchange={() => handleToggle(option)}
						class="border-border h-4 w-4 border-2"
					/>
					<span class="text-foreground-secondary text-sm">{getOptionLabel(option)}</span>
				</label>
			{/each}
		</div>
	{/if}
</div>
