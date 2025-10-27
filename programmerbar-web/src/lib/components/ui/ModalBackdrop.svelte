<script lang="ts">
	type Props = {
		blur?: boolean;
		onclick?: () => void;
	};

	let { blur = true, onclick }: Props = $props();
</script>

<div class="overlay-veil" class:blur aria-hidden="true" {onclick} role="button" tabindex="-1"></div>

<style>
	.overlay-veil {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at center, rgba(17, 17, 17, 0.45), rgba(17, 17, 17, 0.8));
	}

	.overlay-veil.blur {
		backdrop-filter: blur(6px);
	}

	:global(.dark) .overlay-veil {
		background: radial-gradient(circle at center, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.85));
	}
</style>
