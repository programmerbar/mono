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

<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
	<div class="bg-white rounded-lg p-6 max-w-md w-full relative">
		<!-- Admin menu -->
		{#if currentUserRole === 'board'}
			<div class="absolute top-2 right-2">
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
					<div class="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
						<ul>
							<li>
								<button
									class="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
									onclick={() => changeRole('board')}
								>
									{#if selectedUser.role === 'board'}
										<Check class="h-4 w-4 text-green-500 mr-2" />
									{/if}
									<span class="w-6 mr-2"></span> Styret
								</button>
							</li>
							<li>
								<button
									class="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
									onclick={() => changeRole('normal')}
								>
									{#if selectedUser.role === 'normal'}
										<Check class="h-4 w-4 text-green-500 mr-2" />
									{/if}
									<span class="w-6 mr-2"></span> Frivillig
								</button>
							</li>
						</ul>
					</div>
				{/if}
			</div>
		{/if}
		<h2 class="text-xl font-bold mb-4">{selectedUser.name}'s Detaljer</h2>
		<p><strong>E-post:</strong> {selectedUser.email}</p>
		<p><strong>Antall ganger stått:</strong> {selectedUser.timesVolunteered}</p>
		<div class="mt-4">
			<label class="block mb-2">
				<strong>Antall uavhentede øl:</strong>
				<input
					type="number"
					min="0"
					bind:value={unclaimedBeers}
					class="mt-1 p-2 border rounded w-full"
				/>
			</label>
		</div>
		<div class="mt-6 flex justify-end space-x-2">
			<button class="px-4 py-2 bg-green-600 text-white rounded" onclick={updateUnclaimedBeers}>
				Oppdater
			</button>
			<button class="px-4 py-2 bg-gray-600 text-white rounded" onclick={handleClose}>Lukk</button>
		</div>
	</div>
</div>
