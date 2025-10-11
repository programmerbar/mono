<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';

	type Props = {
		open: boolean;
		productName: string;
		creditCost: number;
		onCancel: () => void;
		onConfirm: () => void;
	};

	const beerField = Array.from({ length: 28 }, (_, index) => ({
		left: `${(index * 12) % 100}%`,
		top: `${(index * 18) % 100}%`,
		delay: `${(index % 6) * 0.4}s`,
		duration: `${6 + (index % 4)}s`,
		direction: index % 2 === 0 ? 1 : -1,
		size: 1 + (index % 4) * 0.12
	}));

	let { open, productName, creditCost, onCancel, onConfirm }: Props = $props();
</script>

{#if open}
	<div class="modal-overlay">
		<div class="overlay-veil" aria-hidden="true"></div>
		<div class="beer-backdrop" aria-hidden="true">
			{#each beerField as beer (beer.left + '-' + beer.top + '-' + beer.delay)}
				<span
					class="beer-emoji"
					style={`--left: ${beer.left}; --top: ${beer.top}; --delay: ${beer.delay}; --duration: ${beer.duration}; --direction: ${beer.direction}; --scale: ${beer.size}`}
					aria-hidden="true"
				>
					🍺
				</span>
			{/each}
		</div>

		<div class="modal-content">
			<h2 class="text-2xl font-semibold text-gray-900">Bekreft claiming</h2>
			<p class="mt-3 text-gray-700">
				Du er i ferd med å claime <span class="font-semibold">{productName}</span> for {creditCost}
				{creditCost === 1 ? 'bong' : 'bonger'}.
			</p>
			<p class="mt-2 text-sm text-gray-600">
				Sørg for at du står i baren og er klar til å vise verifiseringsskjermen til ein frivillig.
			</p>

			<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
				<Button type="button" intent="outline" class="sm:w-auto" onclick={onCancel}>Avbryt</Button>
				<Button type="button" class="sm:w-auto" onclick={onConfirm}>Bekreft</Button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		padding: 1.5rem;
	}

	.overlay-veil {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at center, rgba(17, 17, 17, 0.45), rgba(17, 17, 17, 0.8));
		backdrop-filter: blur(6px);
	}

	.modal-content {
		position: relative;
		z-index: 10;
		width: 100%;
		max-width: 28rem;
		max-height: 90svh;
		overflow-y: auto;
		border-radius: 1rem;
		background: white;
		padding: 1.5rem;
		box-shadow: 0 20px 45px rgba(15, 23, 42, 0.35);
	}

	.beer-backdrop {
		position: absolute;
		inset: -10%;
		pointer-events: none;
	}

	.beer-emoji {
		position: absolute;
		left: var(--left);
		top: var(--top);
		font-size: calc(1.8rem * var(--scale));
		animation: float-diagonal var(--duration) linear infinite;
		animation-delay: var(--delay);
		filter: drop-shadow(0 0.25rem 0.35rem rgba(0, 0, 0, 0.25));
		opacity: 0;
	}

	@keyframes float-diagonal {
		0% {
			transform: translate3d(calc(var(--direction) * -12vw), 110%, 0) scale(var(--scale));
			opacity: 0;
		}
		10% {
			opacity: 0.9;
		}
		90% {
			opacity: 0.9;
		}
		100% {
			transform: translate3d(calc(var(--direction) * 12vw), -120%, 0) scale(var(--scale));
			opacity: 0;
		}
	}
</style>
