<script lang="ts">
	import { Ellipsis, Check } from 'lucide-svelte';
	import { error } from '@sveltejs/kit';

	let { selectedUser, currentUserRole = 'normal', onClose, roleChange } = $props();

	let unclaimedBeers = $state(selectedUser.unclaimedBeers);
	let menuOpen = $state(false);

	function handleClose() {
		onClose();
	}

	function toggleMenu(event: MouseEvent) {
		event.stopPropagation();
		menuOpen = !menuOpen;
	}

	function changeRole(newRole: 'board' | 'normal') {
		roleChange({ userId: selectedUser.id, newRole });
		menuOpen = false;
	}

	async function updateUnclaimedBeers() {
		const unclaimedBeersValue = parseInt(unclaimedBeers, 10);

		if (isNaN(unclaimedBeersValue) || unclaimedBeersValue < 0) {
			error(400, { message: 'NaN or Less than 0' });
			return;
		}

		const requestBody = { additionalBeers: unclaimedBeersValue };

		try {
			const response = await fetch(`/portal/admin/user/${selectedUser.id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestBody)
			});

			if (response.ok) {
				unclaimedBeers = unclaimedBeersValue;
			} else {
				const errorData = await response.json();
			}
		} catch (error) {
			console.error('Error with updating the count in usercard:', error);
		}
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
	<div class="relative w-full max-w-md rounded-lg bg-white p-6">
		<!-- Admin menu -->
		{#if currentUserRole === 'board'}
			<div class="absolute right-2 top-2">
				<button
					onclick={toggleMenu}
					aria-haspopup="true"
					aria-expanded={menuOpen}
					aria-label="Toggle admin menu"
				>
					<Ellipsis class="h-5 w-5 text-gray-500" />
				</button>
				{#if menuOpen}
					<!-- Menu -->
					<div class="absolute right-0 z-10 mt-2 w-32 rounded-md bg-white shadow-lg">
						<ul>
							<li>
								<button
									class="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100"
									onclick={() => changeRole('board')}
								>
									{#if selectedUser.role === 'board'}
										<Check class="mr-2 h-4 w-4 text-green-500" />
									{/if}
									<span class="mr-2 w-6"></span> Styret
								</button>
							</li>
							<li>
								<button
									class="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100"
									onclick={() => changeRole('normal')}
								>
									{#if selectedUser.role === 'normal'}
										<Check class="mr-2 h-4 w-4 text-green-500" />
									{/if}
									<span class="mr-2 w-6"></span> Frivillig
								</button>
							</li>
						</ul>
					</div>
				{/if}
			</div>
		{/if}
		<h2 class="mb-4 text-xl font-bold">{selectedUser.name}'s Detaljer</h2>
		<p><strong>E-post:</strong> {selectedUser.email}</p>
		<p><strong>Antall ganger stått:</strong> {selectedUser.timesVolunteered}</p>
		<div class="mt-4">
			<label class="mb-2 block">
				<strong>Antall uavhentede øl:</strong>
				<input
					type="number"
					min="0"
					bind:value={unclaimedBeers}
					class="mt-1 w-full rounded border p-2"
				/>
			</label>
		</div>
		<div class="mt-6 flex justify-end space-x-2">
			<button class="rounded bg-green-600 px-4 py-2 text-white" onclick={updateUnclaimedBeers}>
				Oppdater
			</button>
			<button class="rounded bg-gray-600 px-4 py-2 text-white" onclick={handleClose}>Lukk</button>
		</div>
	</div>
</div>
