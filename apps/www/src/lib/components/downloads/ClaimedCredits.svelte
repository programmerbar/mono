<script lang="ts">
	import { enhance } from '$app/forms';
	import { Download } from '@lucide/svelte';
	import Input from '../ui/Input.svelte';
	import Button from '../ui/Button.svelte';

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
	<div class="mt-6 rounded-lg border-2 bg-background p-4 shadow-lg">
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
				<div class="flex flex-1 flex-col gap-2">
					<label for="startDate" class="flex flex-col gap-1">
						<span class="text-sm font-semibold">From date</span>
						<Input type="datetime-local" id="startDate" name="startDate" bind:value={startDate} />
					</label>

					<label for="endDate" class="flex flex-col gap-1">
						<span class="text-sm font-semibold">To date</span>
						<Input type="datetime-local" id="endDate" name="endDate" bind:value={endDate} />
					</label>

					<Button type="submit" disabled={loading}>
						<Download class="size-4" />
						{loading ? 'Downloading...' : 'Download CSV'}
					</Button>
				</div>
			</div>
		</form>
	</div>
</div>
