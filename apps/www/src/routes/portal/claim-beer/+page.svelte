<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	let { data } = $props();
	let { unclaimedBeers } = $derived(data);

	let loading = $state(false);
</script>

<section>
	{#if unclaimedBeers > 0}
		<p class="mb-6 text-center text-6xl font-bold">{unclaimedBeers} øl igjen</p>

		<form
			class="mx-auto w-fit"
			method="post"
			use:enhance={() => {
				loading = true;

				return async ({ update }) => {
					await update();
					loading = false;
					toast.success('Øl claimet! 🍻');
				};
			}}
		>
			<button
				type="submit"
				disabled={loading}
				class="mx-auto w-fit rounded-md bg-blue-500 px-5 py-2 text-center text-lg font-medium text-white transition-colors hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:opacity-50"
				>Claim Beer</button
			>
		</form>
	{:else}
		<p class="mb-6 text-center text-6xl font-bold">🍻</p>
		<p class="mb-6 text-center text-lg">Du har ingen øl igjen :(</p>
	{/if}
</section>
