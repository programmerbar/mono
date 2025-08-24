<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { buttonVariant, type ButtonVariantProps } from '$lib/styles/button-variant';

	type Props = HTMLAnchorAttributes & ButtonVariantProps;

	let { class: className, intent, children, ...props }: Props = $props();
</script>

<a class={buttonVariant({ intent, className })} {...props}>
	{@render children?.()}
</a>
