<script lang="ts">
	import { urlFor } from '$lib/api/sanity/queries';
	import BeerModal from '$lib/components/ui/BeerModal.svelte';

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

	let { open, product, timerSeconds, remainingCredits = null, onClose }: Props = $props();

	const creditCost = $derived(product.priceList.credits ?? 0);
</script>

<BeerModal {open} maxWidth="xl" onclose={onClose}>
	<div class="flex flex-col gap-6 font-mono">
		<div>
			<h2 class="text-foreground-primary mb-2 text-xl font-semibold">
				<span class="text-foreground-muted">##</span> Vis denne skjermen i baren
			</h2>
			<p class="text-foreground-muted text-sm">
				Frivillige vil bruke denne sida til å verifisere claimen din før du får produktet.
			</p>
		</div>

		<div class="grid gap-6 md:grid-cols-[240px,1fr] md:items-center">
			<div class="flex items-center justify-center">
				{#if product.image}
					<div class="border-border bg-card-muted border-2 p-4">
						<img
							src={urlFor(product.image).width(320).height(320).url()}
							alt={product.name}
							class="max-h-60 max-w-full object-contain"
						/>
					</div>
				{:else}
					<div
						class="border-border bg-card-muted flex h-60 w-full items-center justify-center border-2"
					>
						<p class="text-foreground-muted text-sm font-semibold">404</p>
					</div>
				{/if}
			</div>

			<div class="flex flex-col gap-6">
				<div class="border-border bg-card-muted border-2 p-5 text-center">
					<p class="text-foreground-secondary text-xs font-medium">Produkt</p>
					<p class="text-foreground-primary mt-1 text-2xl font-semibold">{product.name}</p>
					<p class="text-foreground-secondary mt-3 text-xs font-medium">Bong pris</p>
					<p class="text-primary mt-1 text-3xl font-bold">
						{creditCost}
						{creditCost === 1 ? 'bong' : 'bonger'}
					</p>
				</div>

				<div class="border-border bg-card-muted flex flex-col items-center gap-3 border-2 p-5">
					<p class="text-foreground-secondary text-xs font-medium">Verifisering utløper om</p>
					<p class="text-accent-success text-5xl font-extrabold">
						{Math.max(timerSeconds, 0)}
					</p>
					<p class="text-foreground-secondary text-sm">
						Når nedtellingen er ferdig må du eventuelt claime produktet på nytt.
					</p>
					{#if remainingCredits !== null}
						<p class="text-foreground-primary text-sm font-semibold">
							Du har {remainingCredits}
							{remainingCredits === 1 ? 'bong' : 'bonger'} igjen.
						</p>
					{/if}
				</div>
			</div>
		</div>

		<div class="border-border flex flex-col gap-3 border-t pt-4">
			<p class="text-foreground-muted text-sm">
				Trykk «Ferdig» når claimen er verifisert, eller be ein frivillig om hjelp.
			</p>
			<button
				type="button"
				class="border-border bg-card-muted hover:bg-card-hover hover:border-primary text-foreground-primary w-full border-2 px-6 py-3 text-center font-mono text-sm font-semibold transition-all"
				onclick={onClose}
			>
				Ferdig
			</button>
		</div>
	</div>
</BeerModal>
