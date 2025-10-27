<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
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
</BeerModal>
