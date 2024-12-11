<script lang="ts">
	import { enhance } from '$app/forms';

	let message = $state('');
	let error = $state('');

	async function claimBeer(e: Event) {
		e.preventDefault();

		try {
			const response = await fetch('/portal/claim-beer', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			});

			const result = (await response.json()) as { message: string };

			if (response.ok) {
				message = '🎉 Beer successfully claimed! Cheers!';
				error = '';
			} else {
				error = result.message || '⚠️ No more beers left to claim.';
				message = '';
			}
		} catch (err) {
			console.error('Error claiming beer:', err);
			error = '⚠️ An error occurred while claiming beer.';
			message = '';
		}
	}
</script>

<section class="beer-claim">
	<h1>🍺 Claim Your Beer</h1>
	<form onsubmit={claimBeer} use:enhance>
		<button type="submit" class="claim-button">Claim Beer</button>
	</form>

	{#if message}
		<p class="success">{message}</p>
	{/if}

	{#if error}
		<p class="error">{error}</p>
	{/if}
</section>

<style>
	.beer-claim {
		text-align: center;
		padding: 2rem;
		font-family: 'Arial', sans-serif;
		color: #333;
	}

	.claim-button {
		background-color: #28a745;
		color: #fff;
		font-size: 1.2rem;
		border: none;
		padding: 10px 20px;
		border-radius: 8px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.claim-button:hover {
		background-color: #218838;
	}

	.success {
		color: #28a745;
		font-weight: bold;
		margin-top: 1rem;
	}

	.error {
		color: #dc3545;
		font-weight: bold;
		margin-top: 1rem;
	}
</style>
