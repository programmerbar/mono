<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cva, type VariantProps } from 'class-variance-authority';

	const button = cva(
		'inline-flex items-center justify-center whitespace-nowrap rounded-lg border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
		{
			variants: {
				intent: {
					primary:
						'bg-gray-100 hover:bg-gray-300 border-gray-200 hover:border-gray-300 text-gray-800',
					danger: 'bg-red-200 hover:bg-red-300 border-red-300 text-red-500 hover:text-red-700',
					warning:
						'bg-yellow-200 hover:bg-yellow-300 border-yellow-300 text-yellow-600 hover:text-yellow-800'
				},
				size: {
					sm: 'h-8 px-3',
					md: 'h-10 px-4',
					lg: 'h-12 px-5'
				}
			},
			defaultVariants: {
				intent: 'primary',
				size: 'md'
			}
		}
	);

	type Props = HTMLButtonAttributes &
		VariantProps<typeof button> & {
			children: Snippet;
		};

	let { class: className, intent, children, ...props }: Props = $props();
</script>

<button
	type="button"
	{...props}
	class={button({
		intent,
		className
	})}
>
	{@render children()}
</button>
