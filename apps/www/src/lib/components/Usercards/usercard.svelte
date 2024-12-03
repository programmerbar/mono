<script lang="ts">
	import { initials, mailto } from '$lib/utils';

	const { user, onclick } = $props();

	function handleClick() {
		if (onclick) {
			onclick({ detail: { user } });
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			handleClick();
		}
	}
</script>

<div
	class="relative block bg-white border rounded-lg p-4 cursor-pointer"
	role="button"
	tabindex="0"
	onclick={handleClick}
	onkeydown={handleKeyDown}
	aria-label={`Click to view details of ${user.name}`}
>
	<!-- User avatar and name -->
	<div class="flex justify-center mb-2">
		<div class="w-16 h-16 bg-gray-200 flex items-center justify-center border rounded-full">
			<span class="font-medium text-gray-600 text-lg">{initials(user.name)}</span>
		</div>
	</div>

	<div>
		<p class="font-medium text-center">{user.name}</p>
		<p class="text-center text-sm mt-1">
			{#if user.role === 'board'}
				<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
					Styret
				</span>
			{:else}
				<span class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
					Frivillig
				</span>
			{/if}
		</p>
		<p class="text-center text-sm mt-1">
			<a class="hover:underline" href={mailto(user.email)}>{user.email}</a>
		</p>
	</div>
</div>
