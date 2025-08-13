<script lang="ts">
	import type { User } from '$lib/db/schemas';
	import { fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import Button from '../ui/Button.svelte';
	import Input from '../ui/Input.svelte';
	import { outsideClick } from '$lib/actions/outside-click';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	interface Props {
		selectedUser: User;
		onClose: () => void;
	}

	let { selectedUser, onClose }: Props = $props();

	let roleForm = $state<HTMLFormElement | null>(null);
	let unclaimedBeers = $state<number | null>(null);
	let unclaimedBeersState = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let showDeleteSection = $state(false);
	let deleteText = $state('');

	onMount(async () => {
		const response = await fetch(`/portal/admin/user/${selectedUser.id}`);
		unclaimedBeersState = 'loading';

		if (response.ok) {
			const detailedUser = (await response.json()) as User & {
				timesVolunteered: number;
				unclaimedBeers: number;
			};
			unclaimedBeers = detailedUser.unclaimedBeers;
			unclaimedBeersState = 'success';
		} else {
			console.error('Failed to fetch user details');
			unclaimedBeersState = 'error';
		}
	});
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs">
	<div
		in:fly={{ easing: cubicInOut, y: 20, duration: 300 }}
		out:fly={{ easing: cubicInOut, y: 20, duration: 300 }}
		use:outsideClick={() => onClose()}
		class="relative w-full max-w-md rounded-lg bg-white p-6"
	>
		<h2 class="mb-4 text-xl font-bold">{selectedUser.name}'s Detaljer</h2>

		<ul>
			<li>
				<strong>Navn:</strong>
				{selectedUser.name}
			</li>

			<li>
				<strong>E-post:</strong>
				{selectedUser.email}
			</li>

			<li class="flex items-center gap-4">
				<strong>Rolle:</strong>

				<form
					bind:this={roleForm}
					method="post"
					action="/portal/admin"
					class="flex items-center gap-2"
					onchange={roleForm?.submit}
					use:enhance
				>
					<input type="hidden" name="userId" value={selectedUser.id} />

					<label class="relative cursor-pointer">
						<input
							type="radio"
							name="role"
							value="normal"
							class="peer hidden"
							bind:group={selectedUser.role}
						/>
						<span
							class="peer-checked:bg-primary flex items-center justify-center rounded-xl border px-2 py-px
							  text-sm peer-checked:border-transparent peer-checked:text-white
							  hover:bg-gray-200"
						>
							Frivillig
						</span>
					</label>

					<label class="relative cursor-pointer">
						<input
							type="radio"
							name="role"
							value="board"
							class="peer hidden"
							bind:group={selectedUser.role}
						/>
						<span
							class="peer-checked:bg-primary flex items-center justify-center rounded-xl border px-2 py-px
							  text-sm peer-checked:border-transparent peer-checked:text-white
							  hover:bg-gray-200"
						>
							Styret
						</span>
					</label>
				</form>
			</li>
		</ul>

		<hr class="my-4" />

		<form
			method="post"
			action="/portal/admin/user/{selectedUser.id}?/addBeers"
			use:enhance={() => {
				return () => {
					onClose();
				};
			}}
		>
			<div>
				<label class="flex flex-col gap-2">
					<strong>Antall uavhentede øl:</strong>
					<Input type="number" name="additionalBeers" min="0" bind:value={unclaimedBeers} />
				</label>
			</div>
			<div class="mt-6 flex justify-end space-x-2">
				<Button disabled={unclaimedBeersState !== 'success'}>Oppdater</Button>
				<Button type="button" intent="outline" onclick={onClose}>Lukk</Button>
			</div>
		</form>
		<div class="">
			<button type="button" onclick={() => (showDeleteSection = !showDeleteSection)}>
				<p class="font-medium text-red-600">Slett bruker</p>
			</button>

			{#if showDeleteSection}
				<div class="bg-white">
					<form
						method="post"
						action="/portal/admin/user/{selectedUser.id}?/deleteUser"
						use:enhance={() => {
							return async ({ result }) => {
								if (result.type === 'success') {
									await invalidateAll();
									onClose();
								}
							};
						}}
					>
						<input type="hidden" name="userId" value={selectedUser.id} />
						<div class="space-y-2">
							<p class="mb-1 text-sm">
								Skriv <strong>{selectedUser.name}</strong> for å bekrefte
							</p>
							<div class="flex space-x-3">
								<input
									class="min-w-0 flex-1 rounded-xl"
									type="text"
									name="confirmDelete"
									bind:value={deleteText}
									required
								/>
								<Button type="submit" intent="danger" disabled={deleteText !== selectedUser.name}>
									Bekreft sletting
								</Button>
							</div>
						</div>
					</form>
				</div>
			{/if}
		</div>
	</div>
</div>
