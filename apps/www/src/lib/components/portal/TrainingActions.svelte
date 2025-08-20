<script lang="ts">
	import type { CompletionStatus } from '$lib/utils/training';

	interface Props {
		completionStatus: CompletionStatus;
		isTrainingMode: boolean;
		isSaving: boolean;
		onClose: () => void;
		onSave: () => void;
	}

	let { completionStatus, isTrainingMode, isSaving, onClose, onSave }: Props = $props();
</script>

<div class="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4">
	<div class="flex justify-end gap-3">
		<button
			type="button"
			onclick={onClose}
			class="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
			disabled={isSaving}
		>
			Lukk
		</button>
		{#if isTrainingMode}
			<button
				type="button"
				onclick={onSave}
				disabled={isSaving || !completionStatus.isComplete}
				class="rounded-md px-4 py-2 text-sm text-white transition-colors disabled:opacity-50 {completionStatus.isComplete
					? 'bg-green-600 hover:bg-green-700'
					: 'cursor-not-allowed bg-gray-400'}"
			>
				{#if isSaving}
					<span class="flex items-center gap-2">
						<svg
							class="h-4 w-4 animate-spin"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							></path>
						</svg>
						Lagrer...
					</span>
				{:else if completionStatus.isComplete}
					✅ Fullfør opplæring
				{:else}
					Fullfør alle punkter først
				{/if}
			</button>
		{/if}
	</div>
</div>
