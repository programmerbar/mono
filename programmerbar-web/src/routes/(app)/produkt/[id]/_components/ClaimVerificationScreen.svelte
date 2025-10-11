<script lang="ts">
	import { urlFor } from '$lib/api/sanity/image';
	import Button from '$lib/components/ui/Button.svelte';

	type Product = {
		name: string;
		image?: unknown;
		priceList: {
			credits?: number | null;
		};
	};

	type Props = {
		open: boolean;
		product: Product;
		timerSeconds: number;
		remainingCredits?: number | null;
		onClose: () => void;
	};

	const beerField = Array.from({ length: 36 }, (_, index) => ({
		left: `${(index * 9) % 100}%`,
		top: `${(index * 14) % 100}%`,
		delay: `${(index % 7) * 0.35}s`,
		duration: `${7 + (index % 5)}s`,
		direction: index % 2 === 0 ? 1 : -1,
		size: 1 + (index % 5) * 0.1
	}));

	let { open, product, timerSeconds, remainingCredits = null, onClose }: Props = $props();

	const creditCost = $derived(product.priceList.credits ?? 0);
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
			<header class="modal-header">
				<h2 class="text-3xl font-semibold text-gray-900">Vis denne skjermen i baren</h2>
				<p class="text-gray-600">
					Frivillige vil bruke denne sida til å verifisere claimen din før du får produktet.
				</p>
			</header>

			<div class="modal-body">
				<div class="grid gap-6 md:grid-cols-[240px,1fr] md:items-center">
					<div class="flex items-center justify-center">
						{#if product.image}
							<img
								src={urlFor(product.image).width(320).height(320).url()}
								alt={product.name}
								class="max-h-60 max-w-full rounded-xl border bg-white object-contain p-4 shadow"
							/>
						{:else}
							<div
								class="flex h-60 w-full items-center justify-center rounded-xl border bg-gray-100 text-gray-400"
							>
								Ingen bilde
							</div>
						{/if}
					</div>

					<div class="flex flex-col gap-6">
						<div class="rounded-xl border border-indigo-200 bg-indigo-50/70 p-5 text-center">
							<p class="text-sm font-medium text-gray-600">Produkt</p>
							<p class="mt-1 text-2xl font-semibold text-gray-900">{product.name}</p>
							<p class="mt-3 text-sm font-medium text-gray-600">Bong pris</p>
							<p class="mt-1 text-3xl font-bold text-indigo-600">
								{creditCost}
								{creditCost === 1 ? 'bong' : 'bonger'}
							</p>
						</div>

						<div
							class="flex flex-col items-center gap-3 rounded-xl border border-green-200 bg-green-50/70 p-5"
						>
							<p class="text-sm font-medium text-gray-600">Verifisering utløper om</p>
							<p class="text-5xl font-extrabold text-green-600">
								{Math.max(timerSeconds, 0)}
							</p>
							<p class="text-sm text-gray-700">
								Når nedtellingen er ferdig må du eventuelt claime produktet på nytt.
							</p>
							{#if remainingCredits !== null}
								<p class="text-sm font-semibold text-gray-800">
									Du har {remainingCredits}
									{remainingCredits === 1 ? 'bong' : 'bonger'} igjen.
								</p>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<footer class="modal-footer">
				<p class="text-sm text-gray-600">
					Trykk «Ferdig» når claimen er verifisert, eller be ein frivillig om hjelp.
				</p>
				<Button type="button" intent="outline" class="sm:w-auto" onclick={onClose}>Ferdig</Button>
			</footer>
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
		max-width: 40rem;
		max-height: 90svh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		border-radius: 1rem;
		background: white;
		padding: 1.5rem;
		box-shadow: 0 20px 45px rgba(15, 23, 42, 0.35);
	}

	.modal-header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(148, 163, 184, 0.35);
		text-align: center;
	}

	.modal-body {
		flex: 1;
		overflow-y: auto;
		padding: 1rem 0;
	}

	.modal-footer {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding-top: 1rem;
		border-top: 1px solid rgba(148, 163, 184, 0.35);
	}

	@media (min-width: 640px) {
		.modal-footer {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
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
