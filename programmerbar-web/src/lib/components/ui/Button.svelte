<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { buttonVariant, type ButtonVariantProps } from '$lib/components/styles/button-variant';

	type Props = HTMLButtonAttributes & ButtonVariantProps;

	let { class: className, intent, size, children, ...props }: Props = $props();
</script>

<button class={buttonVariant({ intent, size, className })} {...props}>
	{@render children?.()}
</button>
