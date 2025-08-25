<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';

	const pillVariant = cva(
		'inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold',
		{
			variants: {
				variant: {
					blue: 'border-blue-200 bg-blue-100 text-blue-800',
					purple: 'border-purple-200 bg-purple-100 text-purple-800',
					green: 'border-green-200 bg-green-100 text-green-800',
					yellow: 'border-yellow-200 bg-yellow-100 text-yellow-800',
					red: 'border-red-200 bg-red-100 text-red-800',
					gray: 'border-gray-200 bg-gray-100 text-gray-800'
				}
			},
			defaultVariants: {
				variant: 'gray'
			}
		}
	);

	type Props = {
		variant?: VariantProps<typeof pillVariant>['variant'];
		class?: string;
		children: Snippet;
	};

	let { variant, class: className, children }: Props = $props();
</script>

<span class={pillVariant({ variant, className })}>
	{@render children()}
</span>
