<script lang="ts">
	import { Combobox, type Selected } from 'bits-ui';
	import { ChevronUp, Check } from 'lucide-svelte';
	import { cn } from '$lib/cn';

	type Option = Selected<string>;

	type Props = {
		options: Array<Option>;
		placeholder?: string;
		value?: string;
		name?: string;
		class?: string;
		onchange?: (value: Option | undefined) => void;
		disabledOptions?: Array<string>;
	};

	let {
		value = $bindable(),
		options,
		placeholder,
		name,
		onchange,
		class: className,
		disabledOptions
	}: Props = $props();

	let filteredOptions = $derived(
		options.filter((option) => {
			if (!value) return true;
			return option.value.toLowerCase().includes(value.toLowerCase());
		})
	);

	const handleChange = (selected: Selected<string> | undefined) => {
		onchange?.(selected);
	};
</script>

<Combobox.Root items={filteredOptions} bind:inputValue={value} onSelectedChange={handleChange}>
	<div class={cn('relative', className)}>
		<Combobox.Input
			class="placeholder:text-foreground-alt/50 inline-flex h-10 w-full truncate rounded-[9px] border border-border bg-white px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
			{placeholder}
		/>
		<ChevronUp class="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-gray-600" />
	</div>

	<Combobox.Content
		class="max-h-52 w-full overflow-y-auto rounded-xl border border-border bg-white px-1 py-3 shadow outline-none"
		sideOffset={8}
	>
		{#each filteredOptions as option (option.value)}
			<Combobox.Item
				class="flex h-10 w-full select-none items-center rounded-lg py-3 pl-5 pr-1.5 text-sm capitalize outline-none transition-all duration-75 data-[disabled]:cursor-not-allowed data-[highlighted]:bg-muted data-[disabled]:opacity-50"
				value={option.value}
				label={option.label}
				disabled={disabledOptions?.includes(option.value)}
			>
				{option.label}
				<Combobox.ItemIndicator class="ml-auto" asChild={false}>
					<Check />
				</Combobox.ItemIndicator>
			</Combobox.Item>
		{:else}
			<span class="block px-5 py-2 text-sm text-muted-foreground">No results found</span>
		{/each}
	</Combobox.Content>
	{#if name}
		<Combobox.HiddenInput {name} />
	{/if}
</Combobox.Root>
