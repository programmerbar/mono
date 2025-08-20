<script lang="ts">
	import { cn } from '$lib/cn';

	type Props = {
		label: string;
		variant?: 'default' | 'outline';
		size?: 'sm' | 'md';
		class?: string;
	};

	let { label, variant = 'default', size = 'sm', class: className }: Props = $props();
</script>

<span
	class={cn(
		'inline-block font-medium',
		{
			'border border-gray-200 bg-gray-100 text-gray-700': variant === 'default',
			'border border-gray-300 bg-transparent text-gray-600': variant === 'outline',
			'rounded-full px-2 py-1 text-xs': size === 'sm',
			'rounded-lg px-3 py-1.5 text-sm': size === 'md'
		},
		className
	)}
>
	{label}
</span>
