<script lang="ts">
	import type { CompletionStatus } from '$lib/utils/training';

	interface Props {
		completionStatus: CompletionStatus;
		isTrainingMode: boolean;
	}

	let { completionStatus, isTrainingMode }: Props = $props();
</script>

{#if isTrainingMode}
	<div class="mt-6 rounded-lg bg-blue-50 p-4">
		<div class="flex items-center justify-between">
			<div>
				<p class="font-medium text-blue-900">Fremgang</p>
				<p class="text-sm text-blue-700">
					{completionStatus.completedCount} av {completionStatus.totalCount} punkter fullført
				</p>
			</div>
			<div class="text-right">
				<div class="text-2xl font-bold text-blue-600">
					{completionStatus.progressPercentage}%
				</div>
			</div>
		</div>
		<div class="mt-2 h-2 w-full rounded-full bg-blue-200">
			<div
				class="h-2 rounded-full bg-blue-600 transition-all duration-300"
				style="width: {completionStatus.progressPercentage}%"
			></div>
		</div>
	</div>

	{#if completionStatus.isComplete}
		<div class="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
			<div class="flex items-center gap-2">
				<svg
					class="h-5 w-5 text-green-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				<p class="font-medium text-green-800">Gratulerer! All opplæring er fullført.</p>
			</div>
		</div>
	{/if}
{:else}
	<div class="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
		<div class="flex items-center gap-2">
			<svg
				class="h-5 w-5 text-gray-500"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<p class="text-sm text-gray-700">Dette er en referanseliste over opplæringspunkter.</p>
		</div>
	</div>
{/if}
