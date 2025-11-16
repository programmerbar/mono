<script lang="ts">
	import BeerModal from '$lib/components/ui/BeerModal.svelte';

	type Props = {
		open: boolean;
		productName: string;
		creditCost: number;
		onCancel: () => void;
		onConfirm: () => void;
	};

	let { open, productName, creditCost, onCancel, onConfirm }: Props = $props();
</script>

<BeerModal {open} maxWidth="sm" onclose={onCancel}>
	<div class="flex flex-col gap-4 font-mono">
		<div>
			<h2 class="text-foreground-primary mb-3 text-xl font-semibold">
				<span class="text-foreground-muted">##</span> Bekreft claiming
			</h2>
			<p class="text-foreground-secondary">
				Du er i ferd med å claime <span class="text-foreground-primary font-semibold"
					>{productName}</span
				>
				for {creditCost}
				{creditCost === 1 ? 'bong' : 'bonger'}.
			</p>
			<p class="text-foreground-muted mt-2 text-sm">
				Sørg for at du står i baren og er klar til å vise verifiseringsskjermen til ein frivillig.
			</p>
		</div>

		<div class="border-border flex flex-col gap-3 border-t pt-4">
			<button
				type="button"
				class="border-border bg-card-muted hover:bg-card-hover hover:border-primary text-foreground-primary w-full border-2 px-6 py-3 text-center font-mono text-sm font-semibold transition-all"
				onclick={onConfirm}
			>
				Bekreft
			</button>
			<button
				type="button"
				class="border-border bg-card hover:bg-card-hover hover:border-primary text-foreground-secondary w-full border-2 px-6 py-3 text-center font-mono text-sm font-semibold transition-all"
				onclick={onCancel}
			>
				Avbryt
			</button>
		</div>
	</div>
</BeerModal>
