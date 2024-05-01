<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import SEO from '$lib/components/SEO.svelte';
	import { toast } from 'svelte-sonner';
	import EventSelect from './EventSelect.svelte';
	import UsersSelect from './UsersSelect.svelte';
	import { invalidateAll } from '$app/navigation';
	import TimePicker from '$lib/components/TimePicker.svelte';

	let { data } = $props();
	let { users, events } = data;
</script>

<SEO title="Ståplan" />

<main class="max-w-screen-md space-y-8">
	<h1 class="text-2xl font-medium">Ny ståplan</h1>

	<div>
		<form
			class="space-y-4"
			method="post"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						toast.success('Opprettet shift!');
						update({ reset: true });
						invalidateAll();
					} else {
						toast.error('Noe gikk galt. Prøv igjen senere.');
					}
					await applyAction(result);
				};
			}}
		>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label for="name" class="text-sm font-medium">Start</label>
					<input
						type="datetime-local"
						id="start"
						name="start"
						class="w-full border rounded-lg form-input bg-background h-10 border-gray-200"
					/>
				</div>

				<div>
					<label for="end" class="text-sm font-medium">Slutt</label>
					<input
						type="datetime-local"
						id="end"
						name="end"
						class="w-full border rounded-lg form-input bg-background h-10 border-gray-200"
					/>
				</div>
			</div>

			<div>
				<label for="event" class="text-sm font-medium">Arrangement</label>
				<EventSelect
					events={events.map((event) => ({
						label: event.title,
						value: event._id
					}))}
				/>
			</div>

			<div>
				<label for="users" class="text-sm font-medium">Brukere</label>
				<UsersSelect
					users={users.map((user) => ({
						label: user.name,
						value: user.id
					}))}
				/>
			</div>

			<button
				type="submit"
				class="mt-4 h-10 px-4 rounded-lg border hover:bg-gray-200 hover:border-gray-300 transition-colors text-gray-700 font-medium"
			>
				Legg til
			</button>
		</form>
	</div>
</main>
