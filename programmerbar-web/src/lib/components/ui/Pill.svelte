<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';

	const pillVariant = cva(
		'inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold',
		{
			variants: {
				variant: {
					blue: 'border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
					purple:
						'border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300',
					green:
						'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300',
					yellow:
						'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300',
					red: 'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300',
					gray: 'border-gray-200 bg-gray-100 text-gray-800 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-200'
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
