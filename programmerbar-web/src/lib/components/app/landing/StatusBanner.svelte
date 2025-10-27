<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { getStatus } from '../../../../routes/(app)/common.remote';

	const statusQuery = getStatus();
</script>

{#if statusQuery.current}
	<div
		class={cn('w-full py-2 text-center text-sm font-medium transition-all duration-300', {
			'bg-red-100 text-red-800': statusQuery.current.status === 0,
			'bg-green-100 text-green-800': statusQuery.current.status === 1,
			'bg-orange-100 text-orange-800': statusQuery.current.status === 2
		})}
	>
		<div class="mx-auto flex w-fit items-center gap-2">
			<div
				class={cn('h-2 w-2 rounded-full', {
					'bg-red-500': statusQuery.current.status === 0,
					'bg-green-500': statusQuery.current.status === 1,
					'bg-orange-500': statusQuery.current.status === 2
				})}
			></div>
			{statusQuery.current.message}
		</div>
	</div>
{/if}
