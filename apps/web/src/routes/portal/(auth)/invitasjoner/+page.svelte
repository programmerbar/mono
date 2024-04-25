<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { applyAction, enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { formatDate } from '$lib/utils/date';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	let pendingInvitations = $derived(
		data.invitations.filter((invitation) => invitation.redeemedAt === null)
	);
	let redeemedInvitations = $derived(
		data.invitations.filter((invitation) => invitation.redeemedAt !== null)
	);
</script>

<SEO title="Invitasjoner" />

<main class="max-w-screen-md flex flex-col w-full">
	<h1 class="text-2xl font-medium">Invitasjoner</h1>

	<form
		action="?/sendInvitation"
		method="post"
		class="py-14"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					toast.success('Invitasjonen ble sendt!');
					invalidate('invitations');
					await update({ reset: true });
				} else {
					toast.error('Noe gikk galt. Prøv igjen senere.');
				}

				await applyAction(result);
			};
		}}
	>
		<div>
			<label for="email" class="text-sm font-medium">E-post</label>
			<input
				type="email"
				id="email"
				name="email"
				class="w-full border rounded-lg form-input bg-background h-10 border-gray-200"
			/>
		</div>

		<button
			type="submit"
			class="mt-4 h-10 px-4 rounded-lg border hover:bg-gray-200 hover:border-gray-300 transition-colors text-gray-700 font-medium"
			>Send invitasjon</button
		>
	</form>

	<h3 class="text-lg font-medium mt-4">Ventende invitasjoner</h3>
	<ul class="mt-2 grid grid-cols-2 gap-4">
		{#each pendingInvitations as invitation}
			<li>
				<div class="rounded-lg border p-4">
					<p>E-post: {invitation.email}</p>
					<p>Sendt: {formatDate(invitation.createdAt)}</p>
					<p>Utgår: {formatDate(invitation.expiresAt)}</p>

					<form
						action="?/removeInvitation"
						method="post"
						class="mt-4"
						use:enhance={() => {
							return async ({ result, update }) => {
								if (result.type === 'success') {
									toast.success('Invitasjonen ble fjernet!');
									invalidate('invitations');
									await update({ reset: true });
								} else {
									toast.error('Noe gikk galt. Prøv igjen senere.');
								}

								await applyAction(result);
							};
						}}
					>
						<input type="hidden" name="id" value={invitation.id} />
						<button
							type="submit"
							class="h-8 px-4 rounded-lg border bg-red-500 hover:bg-red-600 transition-colors text-white font-medium text-sm"
							>Fjern</button
						>
					</form>
				</div>
			</li>
		{:else}
			<li>
				<p>Ingen ventende invitasjoner</p>
			</li>
		{/each}
	</ul>

	<hr class="my-8" />

	<h3 class="text-lg font-medium mt-4">Brukte invitasjoner</h3>
	<ul class="mt-2 grid grid-cols-2">
		{#each redeemedInvitations as invitation}
			<li>
				<div class="rounded-lg border p-4">
					<p>Epost: {invitation.email}</p>
					<p>Brukt: {formatDate(invitation.redeemedAt!)}</p>
				</div>
			</li>
		{:else}
			<li>
				<p>Ingen brukte invitasjoner</p>
			</li>
		{/each}
	</ul>
</main>
