<script lang="ts">
	import { urlFor } from '$lib/api/sanity/image';
	import type { filterProducts } from '$lib/filter-products';
	type Product = ReturnType<typeof filterProducts>[number];
	type Props = {
		claimedProduct: Product | null;
		timerSeconds: number;
		onClose: () => void;
	};
	let { claimedProduct, timerSeconds, onClose }: Props = $props();

	let progress = $derived((30 - timerSeconds) / 30);
</script>

{#if claimedProduct}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="w-[400px] rounded-lg bg-white p-6 shadow-lg">
			<h2 class="mb-4 text-center text-2xl font-bold">Produkt claimet!</h2>
			<div class="mb-6 flex items-center justify-center">
				{#if claimedProduct.image}
					<img
						src={urlFor(claimedProduct.image).width(200).height(200).url()}
						alt={claimedProduct.name}
						class="h-40 w-40 object-contain"
					/>
				{:else}
					<div class="flex h-40 w-40 items-center justify-center rounded-lg bg-gray-100">
						<span class="text-gray-400">Ingen bilde</span>
					</div>
				{/if}
			</div>
			<div class="mb-6 text-center">
				<p class="text-xl font-semibold">{claimedProduct.name}</p>
				<p class="text-gray-600">Pris: {claimedProduct.priceList.credits} bonger</p>
			</div>
			<div class="mb-6 flex items-center justify-center">
				<div class="relative h-40 w-40">
					<div class="absolute inset-0 flex items-center justify-center">
						<p class="text-4xl font-bold">{Math.ceil(timerSeconds)}</p>
					</div>
					<svg class="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
						<circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" stroke-width="10" />
						<circle
							cx="50"
							cy="50"
							r="45"
							fill="none"
							stroke="#22c55e"
							stroke-width="10"
							stroke-dasharray="283"
							stroke-dashoffset={283 * progress}
							style="transition: stroke-dashoffset 1.5s linear;"
						/>
					</svg>
				</div>
			</div>
			<p class="mb-4 text-center text-gray-700">
				{#if timerSeconds > 0}
					Du har {Math.ceil(timerSeconds)} sekunder igjen til å vise dette produktet.
				{:else}
					Tiden er ute!
				{/if}
			</p>
			<button
				class="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600"
				onclick={onClose}
			>
				Lukk
			</button>
		</div>
	</div>
{/if}
