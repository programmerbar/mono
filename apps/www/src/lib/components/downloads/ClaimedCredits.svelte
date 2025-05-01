<script lang="ts">
	import { enhance } from '$app/forms';
	import { Download } from '@lucide/svelte';

	let startDate = $state('');
	let loading = $state(false);
	let endDate = $state('');

	$effect(() => {
		if (!endDate) {
			const today = new Date();
			const formattedDate = today.toISOString().slice(0, 16);
			endDate = formattedDate;
		}
	});
</script>

<div class="flex max-w-xs flex-col gap-4">
	<div class="mt-6 rounded-lg border bg-white p-4 shadow-md">
		<h3 class="mb-4 text-lg font-semibold">Last ned CSV fil</h3>

		<form
			method="POST"
			action="?/downloadClaimedCredits"
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					loading = false;
					if (result.type === 'success' && result.data?.csvContent) {
						const blob = new Blob([String(result.data.csvContent)], {
							type: 'text/csv;charset=utf-8'
						});
						const url = window.URL.createObjectURL(blob);
						const a = document.createElement('a');
						a.href = url;
						a.download = `claimed-credits-${new Date().toISOString().split('T')[0]}.csv`;
						document.body.appendChild(a);
						a.click();
						window.URL.revokeObjectURL(url);
						document.body.removeChild(a);
					}
				};
			}}
		>
			<div class="flex items-end gap-4">
				<div class="flex-1">
					<label for="startDate" class="mb-1 block text-sm font-medium text-gray-700">
						From Date
					</label>
					<input
						type="datetime-local"
						id="startDate"
						name="startDate"
						bind:value={startDate}
						class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					/>
					<label for="startDate" class="mb-1 block text-sm font-medium text-gray-700">
						To Date
					</label>
					<input
						type="datetime-local"
						id="startDate"
						name="startDate"
						bind:value={endDate}
						class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					/>
					<button
						type="submit"
						disabled={loading}
						class="mt-2 flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
					>
						<Download class="h-4 w-4" />
						{loading ? 'Downloading...' : 'Download CSV'}
					</button>
				</div>
			</div>
		</form>
	</div>
</div>
