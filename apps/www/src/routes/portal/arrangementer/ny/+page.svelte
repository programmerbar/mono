<script lang="ts">
	import type { EventHandler } from 'svelte/elements';
	import { X, Plus, Save, Clock } from '@lucide/svelte';
	import FormInput from '$lib/components/ui/form/FormInput.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Combobox from '$lib/components/ui/Combobox.svelte';
	import { CreateEventState } from '$lib/states/create-event-state.svelte';
	import { differenceInHours } from 'date-fns';

	let { data } = $props();
	let error = $state('');
	let successMessage = $state('');
	let isSubmitting = $state(false);
	let createEventState = new CreateEventState();

	const handleSubmit: EventHandler<SubmitEvent, HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (!createEventState.isValid()) {
			error = 'Vennligst fyll ut alle feltene';
			console.log(createEventState.json());
			return;
		}

		isSubmitting = true;
		error = '';
		successMessage = '';

		try {
			const response = await fetch('/api/events', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(createEventState.json())
			});

			if (response.status === 201) {
				successMessage = 'Arrangement opprettet! E-post er sendt.';
				createEventState.reset();
			} else {
				error = 'Noe gikk galt ved oppretting av arrangement';
			}
		} catch (err) {
			error = 'Server error';
			console.error(err);
		} finally {
			isSubmitting = false;
		}
	};
</script>

<svelte:head>
	<title>Nytt arrangement</title>
</svelte:head>

<div class="mx-auto max-w-4xl overflow-hidden rounded-xl border-2 bg-background shadow-lg">
	<div class="border-b-2 bg-gray-200 px-6 py-4">
		<h2 class="text-lg font-medium">Nytt arrangement</h2>
	</div>
	<div class="p-6">
		{#if error}
			<div class="mb-4 rounded-md bg-red-50 p-4 text-red-700">
				<p>{error}</p>
			</div>
		{/if}

		{#if successMessage}
			<div class="mb-4 rounded-md bg-green-50 p-4 text-green-700">
				<p>{successMessage}</p>
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-6">
			<div class="rounded-lg border-2 bg-background p-4">
				<div class="space-y-4">
					<FormInput
						label="Navn"
						description="Navn på arrangement"
						placeholder="Fest med Foobar"
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
				</div>
			</div>

			<div>
				<h2 class="mb-4 text-lg font-medium">Vakter</h2>
				{#each createEventState.shifts as shift, i}
					{@const startDate = shift.startAt ? new Date(shift.startAt) : new Date()}
					{@const endDate = shift.endAt ? new Date(shift.endAt) : new Date()}
					{@const shiftLength = differenceInHours(endDate, startDate)}
					<div class="relative mb-4 flex flex-col space-y-4 rounded-lg border-2 bg-background p-4">
						<div class="flex items-center justify-between">
							<h3 class="font-medium">Vakt {i + 1}</h3>
							<button
								type="button"
								class="rounded-full p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
								onclick={() => createEventState.deleteShift(i)}
							>
								<X class="h-4 w-4" />
							</button>
						</div>

						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
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
						</div>

						{#if shiftLength >= 4}
							<div class="flex items-center gap-2 rounded bg-orange-50 p-2 text-sm text-orange-700">
								<Clock size={16} />
								<span>NB: Vakten er lengre enn 4 timer!</span>
							</div>
						{/if}

						<div class="mt-2 border-t border-gray-100 pt-4">
							<div class="mb-2 flex items-center justify-between">
								<h4 class="font-medium">Ansvarlige</h4>
								<Button
									type="button"
									onclick={() => createEventState.addUserToShift(i)}
									class="h-auto px-3 py-1 text-sm"
								>
									<Plus size={14} class="mr-1" />
									Legg til
								</Button>
							</div>
							<p class="mb-3 text-xs text-gray-500">
								Alle ansvarlige vil få en e-post med kalenderinvitasjon når arrangementet
								oppdateres.
							</p>

							<div class="space-y-2">
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
											class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:text-red-500"
											onclick={() => createEventState.deleteUserFromShift(i, user.id)}
										>
											<X class="size-4" />
										</button>
									</div>
								{:else}
									<p class="text-sm text-gray-500 italic py-2">
										Ingen ansvarlige. Husk å legge til.
									</p>
								{/each}
							</div>
						</div>
					</div>
				{/each}

				<Button
					type="button"
					intent="primary"
					class="mb-6 w-full justify-center"
					onclick={() => createEventState.addShift()}
				>
					<Plus size={16} class="mr-1" />
					Legg til ny vakt
				</Button>
			</div>

			<div class="flex justify-end gap-4 border-t pt-6">
				<a href="/portal/arrangementer/">
					<Button type="button" intent="warning">Avbryt</Button>
				</a>
				<Button
					type="submit"
					intent="primary"
					disabled={isSubmitting}
					class="flex items-center gap-2"
				>
					<Save size={16} />
					{isSubmitting ? 'Lagrer...' : 'Lagre endringer'}
				</Button>
			</div>
		</form>
	</div>
</div>
