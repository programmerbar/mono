<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { buttonVariant, type ButtonVariantProps } from '$lib/styles/button-variant';
	import type { ResolvedPathname } from '$app/types';

	type Props = Omit<HTMLAnchorAttributes, 'href'> &
		ButtonVariantProps & { href: string | ResolvedPathname };

	let { class: className, intent, children, ...rest }: Props = $props();
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a class={buttonVariant({ intent, className })} {...rest}>
	{@render children?.()}
</a>
