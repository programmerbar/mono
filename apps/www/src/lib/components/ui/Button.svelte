<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { buttonVariant, type ButtonVariantProps } from '$lib/styles/button-variant';

	type Props = HTMLButtonAttributes & ButtonVariantProps;

	let { class: className, intent = 'primary', children, ...props }: Props = $props();
</script>

<button class={buttonVariant({ intent, className })} {...props}>
	{@render children?.()}
</button>
