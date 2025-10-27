<script lang="ts">
	import type { Snippet } from 'svelte';
	import ModalOverlay from './ModalOverlay.svelte';
	import ModalBackdrop from './ModalBackdrop.svelte';
	import BeerBackdrop from './BeerBackdrop.svelte';
	import Modal from './Modal.svelte';

	type Props = {
		open: boolean;
		maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
		children?: Snippet;
		onclose?: () => void;
	};

	let { open, maxWidth = 'md', children, onclose }: Props = $props();
</script>

<ModalOverlay {open}>
	<ModalBackdrop onclick={onclose} />
	<BeerBackdrop />
	<Modal {open} {maxWidth}>
		{@render children?.()}
	</Modal>
</ModalOverlay>
