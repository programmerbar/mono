<script lang="ts">
	const beerField = Array.from({ length: 28 }, (_, index) => ({
		left: `${(index * 12) % 100}%`,
		top: `${(index * 18) % 100}%`,
		delay: `${(index % 6) * 0.4}s`,
		duration: `${6 + (index % 4)}s`,
		direction: index % 2 === 0 ? 1 : -1,
		size: 1 + (index % 4) * 0.12
	}));
</script>

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

<style>
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
