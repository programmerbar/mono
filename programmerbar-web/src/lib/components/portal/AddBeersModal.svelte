<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import ModalOverlay from '$lib/components/ui/ModalOverlay.svelte';
	import ModalBackdrop from '$lib/components/ui/ModalBackdrop.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import ModalHeader from '$lib/components/ui/ModalHeader.svelte';
	import ModalBody from '$lib/components/ui/ModalBody.svelte';
	import ModalFooter from '$lib/components/ui/ModalFooter.svelte';

	interface Props {
		isOpen: boolean;
		userName: string;
		onclose?: () => void;
		onsuccess?: () => void;
	}

	let { isOpen = false, userName, onclose, onsuccess }: Props = $props();

	let additionalBeers = $state(0);
</script>

<ModalOverlay open={isOpen}>
	<ModalBackdrop onclick={onclose} />
	<Modal open={isOpen} maxWidth="md">
		<ModalHeader>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Legg til øl</h3>
			<p class="text-sm text-gray-600 dark:text-gray-300">
				Det du skriver her, vil endre på antall ekstra bonger <strong>{userName}</strong> har tilgjengelig.
			</p>
			<p class="text-sm text-gray-600 dark:text-gray-300">
				Påvirker ikke antall bonger som dei har stått for
			</p>
		</ModalHeader>

		<form
			method="POST"
			action="?/addBeers"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						onclose?.();
						onsuccess?.();
					}
				};
			}}
		>
			<ModalBody>
				<Input
					type="number"
					name="additionalBeers"
					bind:value={additionalBeers}
					placeholder="Antall øl"
					class="w-full"
				/>
			</ModalBody>

			<ModalFooter>
				<div class="flex w-full justify-end gap-3">
					<Button type="button" onclick={onclose} intent="outline">Avbryt</Button>
					<Button type="submit" intent="primary">Legg til</Button>
				</div>
			</ModalFooter>
		</form>
	</Modal>
</ModalOverlay>
