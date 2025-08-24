import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariant = cva(
	'flex items-center justify-center border rounded-lg font-medium transition-all ',
	{
		variants: {
			intent: {
				primary: 'text-white bg-primary border-primary-dark hover:bg-primary-dark',
				outline: 'text-gray-700 border-border hover:bg-gray-200 hover:border-gray-400',
				danger: 'text-white bg-red-500 border-red-800 hover:bg-red-600',
				warning:
					'text-white bg-yellow-500 border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600'
			},
			size: {
				sm: 'text-sm h-8 px-3 py-1.5',
				md: 'text-base h-10 px-4 py-2',
				lg: 'text-lg h-12 px-5 py-3',
				square: 'h-10 w-10 px-0'
			}
		},
		defaultVariants: {
			intent: 'primary',
			size: 'md'
		}
	}
);

export type ButtonVariantProps = VariantProps<typeof buttonVariant>;
