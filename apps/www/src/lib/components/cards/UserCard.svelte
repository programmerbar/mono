<script lang="ts">
	import { initials, mailto } from '$lib/utils';
	import type { User } from '$lib/db/schema';

	interface UserCardProps {
		user: User;
		onSelect?: (user: User) => void;
	}

	let { user, onSelect }: UserCardProps = $props();

	function handleClick() {
		if (onSelect) {
			onSelect(user);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			handleClick();
		}
	}
</script>

<div
	class="relative block cursor-pointer rounded-lg border bg-white p-4"
	role="button"
	tabindex="0"
	onclick={handleClick}
	onkeydown={handleKeyDown}
	aria-label={`Click to view details of ${user.name}`}
>
	<!-- User avatar and name -->
	<div class="mb-2 flex justify-center">
		<div class="flex h-16 w-16 items-center justify-center rounded-full border bg-gray-200">
			<span class="text-lg font-medium text-gray-600">{initials(user.name)}</span>
		</div>
	</div>

	<div>
		<p class="text-center font-medium">{user.name}</p>
		<p class="mt-1 text-center text-sm">
			{#if user.role === 'board'}
				<span class="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
					Styret
				</span>
			{:else}
				<span class="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">
					Frivillig
				</span>
			{/if}
		</p>
		<p class="mt-1 text-center text-sm">
			<a class="hover:underline" href={mailto(user.email)}>{user.email}</a>
		</p>
	</div>
</div>
