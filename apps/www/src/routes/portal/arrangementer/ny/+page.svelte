<script lang="ts">
	import type { EventHandler } from 'svelte/elements';
	import { X } from 'lucide-svelte';
	import Heading from '$lib/components/ui/Heading.svelte';
	import FormInput from '$lib/components/ui/form/FormInput.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Combobox from '$lib/components/ui/Combobox.svelte';
	import { CreateEventState } from '$lib/states/create-event-state.svelte';
	import { differenceInHours } from 'date-fns';

	let { data } = $props();

	let error = $state('');

	let createEventState = new CreateEventState();

	const handleSubmit: EventHandler<SubmitEvent, HTMLFormElement> = async (e) => {
		e.preventDefault();

		if (!createEventState.isValid()) {
			error = 'Vennligst fyll ut alle feltene';
			console.log(createEventState.json());
			return;
		}

		const response = await fetch('/api/events', {
			method: 'POST',
			body: JSON.stringify(createEventState.json())
		});

		if (response.status === 201) {
			createEventState.reset();
		}
	};
</script>

<svelte:head>
	<title>Nytt arrangement</title>
</svelte:head>

<Heading class="mb-4">Nytt arrangement</Heading>

{#if error}
	<p class="text-red-500">{error}</p>
{/if}

<form onsubmit={handleSubmit} class="space-y-2">
	<FormInput
		label="Navn"
		description="Navnet på arrangementet"
		bind:value={createEventState.name}
		required
	/>
	<FormInput
		label="Dato"
		description="Start datoen på arrangementet"
		bind:value={createEventState.date}
		type="datetime-local"
		required
	/>

	{#each createEventState.shifts as shift, i}
		{@const shiftLength = differenceInHours(shift.endAt, shift.startAt)}
		<div class="border-border relative flex flex-col space-y-2 rounded-lg border p-4">
			<button
				type="button"
				class="absolute right-4 top-4 text-red-400 transition-colors hover:text-red-600"
				onclick={() => createEventState.deleteShift(i)}
			>
				<X class="h-4 w-4" />
			</button>

			<h2 class="text-lg font-semibold">Vakt {i + 1}</h2>
			<FormInput
				label="Start"
				description="Start tidspunkt for vakten"
				bind:value={shift.startAt}
				type="datetime-local"
				required
			/>
			<FormInput
				label="Slutt"
				description="Slutt tidspunkt for vakten"
				bind:value={shift.endAt}
				type="datetime-local"
				required
			/>

			{#if shiftLength >= 4}
				<span class="text-sm font-medium text-orange-500">NB: Vakten er lengre enn 4 timer!</span>
			{/if}

			<span class="mt-8 text-sm font-medium">Ansvarlige</span>

			{#each createEventState.shifts[i].users as user, j (user)}
				<div class="flex items-center gap-2">
					<Combobox
						name="user"
						class="flex-1"
						bind:value={createEventState.shifts[i].users[j].name}
						disabledOptions={createEventState.shifts[i].users.map((user) => user.id)}
						onchange={(option) => {
							const id = option?.value;
							if (id) {
								createEventState.shifts[i].users[j].id = id;
							}
						}}
						options={data.users}
						placeholder="Velg en bruker"
					/>
					<button
						type="button"
						class="border-border flex h-10 w-10 items-center justify-center rounded-lg border bg-white transition-colors hover:text-red-500"
						onclick={() => createEventState.deleteUserFromShift(i, user.id)}
					>
						<X class="size-4" />
					</button>
				</div>
			{:else}
				<p class="text-sm text-gray-600">Ingen ansvarlige. Husk å legge til.</p>
			{/each}

			<Button type="button" onclick={() => createEventState.addUserToShift(i)}
				>Legg til bruker</Button
			>
		</div>
	{/each}

	<Button type="button" onclick={() => createEventState.addShift()}>Legg til vakt</Button>

	<Button type="submit">Lagre</Button>
</form>
