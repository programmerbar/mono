<script lang="ts">
	import { X, Plus, Save, Trash2 } from '@lucide/svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import FormInput from '$lib/components/ui/form/FormInput.svelte';
	import Combobox from '$lib/components/ui/Combobox.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import { enhance } from '$app/forms';
	import { CreateEventState } from '$lib/states/create-event-state.svelte';
	import { toDateTimeLocalInput } from '$lib/date';
	import { beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data, form } = $props();

	let showDeleteConfirm = $state(false);

	const eventState = new CreateEventState();

	onMount(() => {
		eventState.name = data.event.name;
		eventState.date = toDateTimeLocalInput(data.event.date);
		eventState.description = data.event.description || '';
		eventState.shouldBePublic = !!(data.event.description || data.event.slug);

		data.event.shifts.forEach((shift) => {
			eventState.shifts.push({
				startAt: toDateTimeLocalInput(shift.startAt),
				endAt: toDateTimeLocalInput(shift.endAt),
				users: shift.members.map((member) => ({
					id: member.user.id,
					name: member.user.name
				}))
			});
		});
	});

	let originalShifts = $state(data.event.shifts.map((shift) => ({ id: shift.id })));
	let deletedShiftIds = $state<Array<string>>([]);
	let removedUserShifts = $state<Array<string>>([]);

	beforeNavigate(({ cancel }) => {
		if (deletedShiftIds.length > 0 || removedUserShifts.length > 0) {
			if (!confirm('Du har ulagrede endringer. Er du sikker på at du vil forlate siden?')) {
				cancel();
			}
		}
	});
</script>

<svelte:head>
	<title>Rediger arrangement: {eventState.name}</title>
</svelte:head>

<div class="bg-background mx-auto max-w-4xl overflow-hidden rounded-xl border-2 shadow-lg">
	<div class="items-centter flex justify-between border-b-2 bg-gray-200 px-6 py-4">
		<h2 class="text-lg font-semibold">Arrangement detaljer</h2>
		<form method="POST" action="?/delete" use:enhance>
			<Button
				type="submit"
				intent="danger"
				onclick={(e) => {
					if (!showDeleteConfirm) {
						e.preventDefault();
						showDeleteConfirm = true;
					}
				}}
			>
				<Trash2 class="mr-1 h-4 w-4" />
				{showDeleteConfirm ? 'Er du sikker?' : 'Slett arrangement'}
			</Button>
		</form>
	</div>

	<div class="p-6">
		{#if form?.message}
			<div
				class="mb-4 rounded-md p-4 {form.success
					? 'bg-green-50 text-green-700'
					: 'bg-red-50 text-red-700'}"
			>
				<p>{form.message}</p>
			</div>
		{/if}

		{#if deletedShiftIds.length > 0 || removedUserShifts.length > 0}
			<div class="mb-4 rounded-md bg-yellow-50 p-4 text-yellow-700">
				<p class="font-medium">Ulagrede endringer:</p>
				<ul class="mt-1 text-sm">
					{#if deletedShiftIds.length > 0}
						<li>
							• {deletedShiftIds.length} vakt{deletedShiftIds.length > 1 ? 'er' : ''} vil bli slettet
						</li>
					{/if}
					{#if removedUserShifts.length > 0}
						<li>
							• {removedUserShifts.length} bruker{removedUserShifts.length > 1 ? 'e' : ''} vil bli fjernet
						</li>
					{/if}
				</ul>
			</div>
		{/if}

		<form method="POST" action="?/save" use:enhance>
			<input type="hidden" name="shiftsCount" value={eventState.shifts.length} />
			<input type="hidden" name="shouldBePublic" value={eventState.shouldBePublic} />
			<input type="hidden" name="slug" value={eventState.shouldBePublic ? eventState.slug : ''} />
			{#each deletedShiftIds as id (id)}
				<input type="hidden" name="deletedShiftIds" value={id} />
			{/each}
			{#each removedUserShifts as keyValue (keyValue)}
				<input type="hidden" name="removedUserShifts" value={keyValue} />
			{/each}

			<div class="bg-background mb-6 rounded-lg border-2 p-4 shadow-lg">
				<div class="space-y-4">
					<FormInput label="Navn" name="name" bind:value={eventState.name} required />
					<FormInput
						label="Dato"
						name="date"
						bind:value={eventState.date}
						type="datetime-local"
						required
					/>
					<Checkbox
						id="shouldBePublic"
						bind:checked={eventState.shouldBePublic}
						label="Skal være offentlig"
					/>
					{#if eventState.shouldBePublic}
						<div class="space-y-2">
							<label for="description" class="block text-sm font-medium text-gray-700">
								Beskrivelse
							</label>
							<p class="text-sm text-gray-500">Beskrivelse av arrangementet (valgfritt)</p>
							<Textarea
								id="description"
								name="description"
								bind:value={eventState.description}
								placeholder="Skriv en beskrivelse av arrangementet..."
								class="min-h-24"
							/>
						</div>
					{/if}
				</div>
			</div>

			<div class="mb-6">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-lg font-medium">Vakter</h2>
					<Button
						type="button"
						intent="primary"
						class="text-sm"
						onclick={() => eventState.addShift()}
					>
						<Plus class="mr-1 h-4 w-4" />
						Legg til vakt
					</Button>
				</div>

				{#each eventState.shifts as shift, i (shift.startAt.toString() + shift.endAt.toString())}
					<div class="bg-background mb-4 rounded-lg border-2 p-4 shadow-lg transition-opacity">
						<div class="flex items-center justify-between">
							<h3 class="font-medium">Vakt {i + 1}</h3>
							<button
								type="button"
								class="rounded-full p-1 text-red-400 hover:text-red-600"
								onclick={() => {
									if (i < originalShifts.length) {
										deletedShiftIds.push(originalShifts[i].id);
									}
									eventState.deleteShift(i);

									if (i < originalShifts.length) {
										originalShifts.splice(i, 1);
									}
								}}
							>
								<X class="h-4 w-4" />
							</button>
						</div>

						{#if i < originalShifts.length}
							<input type="hidden" name={`shift[${i}].id`} value={originalShifts[i].id} />
						{/if}

						<div class="mt-4 grid gap-4 md:grid-cols-2">
							<FormInput
								label="Start"
								name={`shift[${i}].startAt`}
								bind:value={shift.startAt}
								type="datetime-local"
								required
							/>
							<FormInput
								label="Slutt"
								name={`shift[${i}].endAt`}
								bind:value={shift.endAt}
								type="datetime-local"
								required
							/>
						</div>

						<div class="mt-4 border-t pt-4">
							<div class="mb-2 flex items-center justify-between">
								<h4 class="font-medium">Ansvarlige</h4>
								<Button type="button" class="text-sm" onclick={() => eventState.addUserToShift(i)}>
									<Plus class="mr-1 h-4 w-4" />
									Legg til
								</Button>
							</div>

							<input type="hidden" name={`shift[${i}].userCount`} value={shift.users.length} />

							{#if shift.users.length === 0}
								<p class="py-2 text-sm text-gray-500 italic">Ingen ansvarlige</p>
							{:else}
								<div class="space-y-2">
									{#each shift.users as user, j (user.id)}
										<div class="flex items-center gap-2">
											<Combobox
												type="single"
												name="shift[{i}].user[{j}].id"
												inputValue={eventState.shifts[i].users[j].name}
												bind:value={eventState.shifts[i].users[j].id}
												items={data.users}
												disabledOptions={eventState.shifts[i].users
													.filter((u) => u.id && u.id !== user.id)
													.map((u) => u.id)}
												onValueChange={(option) => {
													const selectedUser = data.users.find((u) => u.value === option);
													if (selectedUser) {
														eventState.shifts[i].users[j].id = selectedUser.value;
														eventState.shifts[i].users[j].name = selectedUser.label;
													}
												}}
												inputProps={{
													class: 'flex-1',
													placeholder: 'Velg en bruker'
												}}
											/>
											<button
												type="button"
												class="flex h-10 w-10 items-center justify-center rounded-lg border hover:text-red-500"
												onclick={() => {
													if (i < originalShifts.length && user.id) {
														removedUserShifts = [
															...removedUserShifts,
															`${originalShifts[i].id}|${user.id}`
														];
													}
													eventState.deleteUserFromShift(i, user.id);
												}}
											>
												<X class="h-4 w-4" />
											</button>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<div class="flex justify-end gap-4 border-t pt-6">
				<div class="flex gap-2">
					<a href="/portal/arrangementer/">
						<Button type="button" intent="warning">Avbryt</Button>
					</a>
					<Button type="submit" intent="primary" disabled={!eventState.isValid()}>
						<Save class="mr-1 h-4 w-4" />
						Lagre endringer
					</Button>
				</div>
			</div>
		</form>
	</div>
</div>
