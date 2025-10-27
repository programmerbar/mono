<script lang="ts">
	import { urlFor } from '$lib/api/sanity/queries';
	import Button from '$lib/components/ui/Button.svelte';
	import BeerModal from '$lib/components/ui/BeerModal.svelte';
	import ModalHeader from '$lib/components/ui/ModalHeader.svelte';
	import ModalBody from '$lib/components/ui/ModalBody.svelte';
	import ModalFooter from '$lib/components/ui/ModalFooter.svelte';

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
	<ModalHeader
		title="Vis denne skjermen i baren"
		description="Frivillige vil bruke denne sida til å verifisere claimen din før du får produktet."
	/>

	<ModalBody>
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
	</ModalBody>

	<ModalFooter>
		<p class="text-sm text-gray-600">
			Trykk «Ferdig» når claimen er verifisert, eller be ein frivillig om hjelp.
		</p>
		<Button type="button" intent="outline" class="sm:w-auto" onclick={onClose}>Ferdig</Button>
	</ModalFooter>
</BeerModal>
