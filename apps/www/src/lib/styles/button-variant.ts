import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariant = cva(
	'flex items-center justify-center border rounded-lg py-2 font-medium px-4 h-10 transition-all ',
	{
		variants: {
			intent: {
				primary: 'text-white bg-primary border-primary-dark hover:bg-primary-dark',
				outline: 'text-gray-700 border-border hover:bg-gray-200 hover:border-gray-400',
				danger: 'text-white bg-red-500 border-red-800 hover:bg-red-600',
				warning:
					'text-white bg-yellow-500 border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600'
			}
		}
	}
);

export type ButtonVariantProps = VariantProps<typeof buttonVariant>;
