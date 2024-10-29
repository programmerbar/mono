<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { initials, mailto } from '$lib/utils'; // Added 'mailto'

	export let user;
	export let currentUserRole = 'normal'; // Default role, can be overridden
	export let showMenu = false; // Control whether to show the role editing menu

	const dispatch = createEventDispatcher();

	// State for the open menu
	let menuOpen = false;

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	// Emit an event when the role is changed
	function changeRole(newRole: string) {
		dispatch('roleChange', { userId: user.id, newRole });
		menuOpen = false;
	}
</script>

<li class="relative block bg-white border rounded-lg p-4">
	{#if showMenu && currentUserRole === 'board'}
		<div class="absolute top-2 right-2">
			<button on:click={toggleMenu}>
				<!-- Three dots icon -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-gray-500"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M10 3a1 1 0 110-2 1 1 0 010 2zm0 5a1 1 0 110-2 1 1 0 010 2zm0 5a1 1 0 110-2 1 1 0 010 2z"
					/>
				</svg>
			</button>
			{#if menuOpen}
				<!-- The menu -->
				<div class="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
					<ul>
						<li>
							<button
								class="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
								on:click={() => changeRole('board')}
							>
								{#if user.role === 'board'}
									<!-- Checkmark icon -->
									<svg class="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414L9 14.414 5.293 10.707a1 1 0 00-1.414 1.414L9 17.414l8-8a1 1 0 00-1.414-1.414z"
											clip-rule="evenodd"
										/>
									</svg>
								{:else}
									<span class="w-6 mr-2"></span>
								{/if}
								Styret
							</button>
						</li>
						<li>
							<button
								class="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
								on:click={() => changeRole('normal')}
							>
								{#if user.role === 'normal'}
									<!-- Checkmark icon -->
									<svg class="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414L9 14.414 5.293 10.707a1 1 0 00-1.414 1.414L9 17.414l8-8a1 1 0 00-1.414-1.414z"
											clip-rule="evenodd"
										/>
									</svg>
								{:else}
									<span class="w-6 mr-2"></span>
								{/if}
								Frivillig
							</button>
						</li>
					</ul>
				</div>
			{/if}
		</div>
	{/if}

	<!-- User avatar and name -->
	<div class="flex justify-center mb-2">
		<div class="w-16 h-16 bg-gray-200 flex items-center justify-center border rounded-full">
			<span class="font-medium text-gray-600 text-lg">{initials(user.name)}</span>
		</div>
	</div>

	<div>
		<p class="font-medium text-center">{user.name}</p>
		<p class="text-center text-sm mt-1">
			<a class="hover:underline" href={mailto(user.email)}>{user.email}</a>
		</p>
		<!-- Role badge -->
		<p class="text-center text-sm mt-1">
			{#if user.role === 'board'}
				<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
					>Styret</span
				>
			{:else}
				<span class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
					>Frivillig</span
				>
			{/if}
		</p>
	</div>
</li>

<style>
	/* Add any component-specific styles here */
</style>
