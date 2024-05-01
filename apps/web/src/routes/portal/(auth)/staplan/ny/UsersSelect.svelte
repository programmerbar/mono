<script lang="ts">
	import { Combobox } from 'bits-ui';
	import { Check, ChevronDown } from 'lucide-svelte';

	type InputValue = {
		value: string;
		label: string;
	};

	type Props = {
		users: Array<InputValue>;
	};

	let { users }: Props = $props();

	let inputValue = $state('');
	let selected = $state<Array<InputValue>>([]);
	let touchedInput = $state(false);

	let filteredUsers = $derived(
		inputValue && touchedInput
			? users.filter((event) => event.value.includes(inputValue.toLowerCase()))
			: users
	);

	let value = $derived(
		selected.length === 0 ? null : selected.map((user) => user.label).join(', ')
	);
</script>

<Combobox.Root
	multiple={true}
	bind:selected
	items={filteredUsers}
	bind:inputValue
	bind:touchedInput
>
	<div class="relative">
		<Combobox.Input
			class="inline-flex h-10 w-full truncate rounded-lg border border-gray-200 bg-background px-4 text-sm transition-colors placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
			{value}
			placeholder="Søk etter brukere"
			aria-label="Søk etter brukere"
		/>
		<ChevronDown
			class="absolute h-5 w-5 end-3 top-1/2 size-6 -translate-y-1/2 text-muted-foreground"
		/>
	</div>

	<Combobox.Content
		class="w-full rounded-xl border border-muted bg-background px-1 py-3 shadow-popover outline-none"
		sideOffset={8}
	>
		{#each filteredUsers as user (user.value)}
			<Combobox.Item
				class="flex h-10 w-full select-none items-center rounded-lg py-3 pl-5 pr-1.5 text-sm capitalize outline-none transition-all duration-75 data-[highlighted]:bg-gray-200"
				value={user.value}
				label={user.label}
			>
				{user.label}
				<Combobox.ItemIndicator class="ml-auto" asChild={false}>
					<Check class="h-4 w-4" />
				</Combobox.ItemIndicator>
			</Combobox.Item>
		{:else}
			<span class="block px-5 py-2 text-sm text-muted-foreground">Fant ingen brukere</span>
		{/each}
	</Combobox.Content>

	<Combobox.HiddenInput name="users" />
</Combobox.Root>
