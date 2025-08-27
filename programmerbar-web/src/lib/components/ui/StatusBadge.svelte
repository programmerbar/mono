<script lang="ts">
	import { cn } from '$lib/cn';

	type Status = 'approved' | 'pending' | 'rejected' | 'board' | 'normal' | 'active' | 'inactive';

	interface Props {
		status: Status;
		text?: string;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let { status, text, size = 'md', class: className }: Props = $props();

	const statusConfig = {
		approved: { color: 'bg-green-100 text-green-800', defaultText: 'Approved' },
		pending: { color: 'bg-yellow-100 text-yellow-800', defaultText: 'Pending' },
		rejected: { color: 'bg-red-100 text-red-800', defaultText: 'Rejected' },
		board: { color: 'bg-purple-100 text-purple-800', defaultText: 'Board' },
		normal: { color: 'bg-gray-100 text-gray-800', defaultText: 'Normal' },
		active: { color: 'bg-blue-100 text-blue-800', defaultText: 'Active' },
		inactive: { color: 'bg-gray-100 text-gray-600', defaultText: 'Inactive' }
	};

	const sizeClasses = {
		sm: 'px-2 py-1 text-xs',
		md: 'px-3 py-1 text-sm',
		lg: 'px-4 py-2 text-base'
	};

	const displayText = text || statusConfig[status].defaultText;
</script>

<span
	class={cn(
		'inline-flex items-center rounded-full font-medium',
		statusConfig[status].color,
		sizeClasses[size],
		className
	)}
>
	{displayText}
</span>
