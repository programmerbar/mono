<script lang="ts">
	import { getProfilePicture } from '$lib/data/api';
	import { mailTo } from '$lib/utils/prefixes';
	import { User2 } from 'lucide-svelte';

	type Props = {
		id: string;
		name: string;
		email: string;
		isUser: boolean;
	};

	let { id, name, email, isUser }: Props = $props();

	let imageError = $state(false);
</script>

<div class="p-4 rounded-lg border h-full space-y-2">
	<div
		class="h-20 w-20 rounded-full bg-gray-200 mx-auto border-2 border-gray-400 flex flex-col items-center justify-center"
	>
		{#if imageError}
			<User2 class="h-10 w-10 text-gray-500" />
		{:else}
			<img
				class="h-20 w-20 rounded-full"
				onerror={() => (imageError = true)}
				src="/profile-pic/{id}"
				alt="Profilbilde"
			/>
		{/if}
	</div>

	<h2 class="text-xl font-medium text-center text-balance">
		{name}
		{#if isUser}
			<span class="text-xs text-gray-500">(deg)</span>
		{/if}
	</h2>

	<p class="text-center">
		<a class="hover:underline text-blue-500" href={mailTo(email)}>{email}</a>
	</p>
</div>
