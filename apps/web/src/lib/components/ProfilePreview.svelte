<script lang="ts">
	import { mailTo } from '$lib/utils/prefixes';
	import Avatar from './Avatar.svelte';

	type Props = {
		id: string;
		name: string;
		email: string;
		isUser: boolean;
	};

	let { id, name, email, isUser }: Props = $props();
</script>

<div class="p-4 rounded-lg border overflow-hidden h-full space-y-2">
	<Avatar class="mx-auto mb-4" src="/avatar/{id}" alt={name} initials={name.slice(0, 2)} />

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
