<script lang="ts">
	import { enhance } from '$app/forms';
	import SEO from '$lib/components/SEO.svelte';

	let { data } = $props();
</script>

<SEO title="Logg inn" />

<div class="min-h-screen bg-[url('/circuit-board.svg')] flex flex-col items-center justify-center">
	<div class="p-16 rounded-lg border shadow-lg bg-background flex flex-col justify-center">
		<div class="mb-14">
			<h1 class="text-xl font-medium text-center">Lag bruker</h1>
		</div>

		<form action="?/acceptInvitation" method="post" use:enhance>
			<input type="hidden" name="code" bind:value={data.invitation.id} />
			<button
				class="hover:underline mx-auto h-10 font-medium bg-primary rounded-lg px-4 shadow-lg w-full flex items-center justify-center text-white border-2 border-black"
			>
				Lag bruker med Feide
			</button>
		</form>
	</div>
</div>
