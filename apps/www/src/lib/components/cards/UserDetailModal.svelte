<script lang="ts">
	import type { User } from '$lib/db/schema';
	import { fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import Button from '../ui/Button.svelte';
	import Input from '../ui/Input.svelte';
	import { cn } from '$lib/cn';
	import { outsideClick } from '$lib/actions/outside-click';
	import { invalidateAll } from '$app/navigation';

	interface ExtendedUser extends User {
		timesVolunteered: number;
		unclaimedBeers: number;
	}

	interface Props {
		selectedUser: ExtendedUser;
		currentUserRole?: 'board' | 'normal';
		onClose: () => void;
	}

	let { selectedUser, onClose }: Props = $props();

	let unclaimedBeers = $state(String(selectedUser.unclaimedBeers));

	async function updateRole(newRole: 'board' | 'normal') {
		const formData = new FormData();
		formData.append('userId', selectedUser.id);
		formData.append('role', newRole);
		formData.append('/', 'updateRole');

		try {
			const response = await fetch('/portal/admin', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				invalidateAll();
			} else {
				console.error('Failed to update user role');
			}
		} catch (error) {
			console.error('Error updating user role:', error);
		}
	}
	async function updateUnclaimedBeers() {
		const unclaimedBeersValue = parseInt(unclaimedBeers, 10);

		const requestBody = { additionalBeers: unclaimedBeersValue };

		try {
			const response = await fetch(`/portal/admin/user/${selectedUser.id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestBody)
			});

			if (response.ok) {
				unclaimedBeers = String(unclaimedBeersValue);
			} else {
				const errorData = await response.json();
				console.error('Error updating unclaimed beers:', errorData);
			}
		} catch (error) {
			console.error('Error with updating the count in usercard:', error);
		}
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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

				<div class="flex items-center gap-2">
					<button
						onclick={() => updateRole('normal')}
						class={cn('flex items-center justify-center rounded-xl border px-2 py-px text-sm', {
							'border-transparent bg-primary text-white': selectedUser.role === 'normal',
							'hover:bg-gray-200': selectedUser.role !== 'normal'
						})}>Frivillig</button
					>
					<button
						onclick={() => updateRole('board')}
						class={cn('flex items-center justify-center rounded-xl border px-2 py-px text-sm', {
							'border-transparent bg-primary text-white': selectedUser.role === 'board',
							'hover:bg-gray-200': selectedUser.role !== 'board'
						})}>Styret</button
					>
				</div>
			</li>
		</ul>

		<div class="mt-4">
			<label class="flex flex-col gap-2">
				<strong>Antall uavhentede øl:</strong>
				<Input type="number" min="0" bind:value={unclaimedBeers} />
			</label>
		</div>
		<div class="mt-6 flex justify-end space-x-2">
			<Button onclick={updateUnclaimedBeers}>Oppdater</Button>
			<Button intent="outline" onclick={onClose}>Lukk</Button>
		</div>
	</div>
</div>
