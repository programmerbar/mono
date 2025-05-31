<script lang="ts">
	import { X, Plus, Save, Trash2 } from '@lucide/svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import FormInput from '$lib/components/ui/form/FormInput.svelte';
	import Combobox from '$lib/components/ui/Combobox.svelte';
	import { enhance } from '$app/forms';
	import { CreateEventState } from '$lib/states/create-event-state.svelte';
	import { ISOStandard } from '$lib/date';
	import { beforeNavigate } from '$app/navigation';

	let { data, form } = $props();

	let showDeleteConfirm = $state(false);

	const eventState = new CreateEventState();

	eventState.name = data.event.name;
	eventState.date = ISOStandard(data.event.date);

	data.event.shifts.forEach((shift) => {
		eventState.shifts.push({
			startAt: ISOStandard(shift.startAt),
			endAt: ISOStandard(shift.endAt),
			users: shift.members.map((member) => ({
				id: member.user.id,
				name: member.user.name
			}))
		});
	});

	let originalShifts = $state(data.event.shifts.map((shift) => ({ id: shift.id })));
	let deletedShiftIds = $state([] as string[]);
	let removedUserShifts = $state([] as string[]);

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

<div class="mx-auto max-w-4xl overflow-hidden rounded-xl border-2 bg-background shadow-lg">
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
			{#each deletedShiftIds as id}
				<input type="hidden" name="deletedShiftIds" value={id} />
			{/each}
			{#each removedUserShifts as keyValue}
				<input type="hidden" name="removedUserShifts" value={keyValue} />
			{/each}

			<div class="mb-6 rounded-lg border-2 bg-background p-4 shadow-lg">
				<div class="space-y-4">
					<FormInput label="Navn" name="name" bind:value={eventState.name} required />
					<FormInput
						label="Dato"
						name="date"
						bind:value={eventState.date}
						type="datetime-local"
						required
					/>
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

				{#each eventState.shifts as shift, i}
					<div class="mb-4 rounded-lg border-2 bg-background p-4 shadow-lg transition-opacity">
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
								<p class="py-2 text-sm italic text-gray-500">Ingen ansvarlige</p>
							{:else}
								<div class="space-y-2">
									{#each shift.users as user, j}
										<div class="flex items-center gap-2">
											<Combobox
												name={`shift[${i}].user[${j}].name`}
												class="flex-1"
												bind:value={user.name}
												options={data.users}
												disabledOptions={eventState.shifts[i].users
													.filter((u) => u.id && u.id !== user.id)
													.map((u) => u.id)}
												onchange={(option) => {
													if (option?.value) {
														user.id = option.value;
														user.name = option.label || '';
													}
												}}
												placeholder="Velg en bruker"
											/>
											<input type="hidden" name={`shift[${i}].user[${j}].id`} value={user.id} />
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
