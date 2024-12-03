<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let selectedUser;

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
	<div class="w-full max-w-md rounded-lg bg-white p-6">
		<h2 class="mb-4 text-xl font-bold">{selectedUser.name}'s Details</h2>
		<p><strong>Email:</strong> {selectedUser.email}</p>
		<p><strong>Antall ganger stått:</strong> {selectedUser.timesVolunteered}</p>
		<p><strong>Antall øl igjen:</strong> {selectedUser.unclaimedBeers}</p>

		<div class="mt-6 flex justify-end">
			<button class="rounded bg-blue-600 px-4 py-2 text-white" on:click={closeModal}>Close</button>
		</div>
	</div>
</div>

<style>
	/* Add any component-specific styles here */
</style>
