<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let selectedUser;

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}
</script>

<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
	<div class="bg-white rounded-lg p-6 max-w-md w-full">
		<h2 class="text-xl font-bold mb-4">{selectedUser.name}'s Details</h2>
		<p><strong>Email:</strong> {selectedUser.email}</p>
		<p><strong>Antall ganger stått:</strong> {selectedUser.timesVolunteered}</p>
		<p><strong>Antall øl igjen:</strong> {selectedUser.unclaimedBeers}</p>

		<div class="mt-6 flex justify-end">
			<button class="px-4 py-2 bg-blue-600 text-white rounded" on:click={closeModal}>Close</button>
		</div>
	</div>
</div>

<style>
	/* Add any component-specific styles here */
</style>
