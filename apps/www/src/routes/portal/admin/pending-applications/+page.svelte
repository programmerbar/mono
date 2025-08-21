<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { normalDate } from '$lib/date';

	let { data, form } = $props();

	let processingId = $state<string | null>(null);
</script>

<svelte:head>
	<title>Admin - Søkere</title>
</svelte:head>

<section class="space-y-6">
	<Heading>Frivillig-søknader</Heading>

	{#if form?.success}
		<div class="rounded-md bg-green-50 p-4 text-green-700">
			<p>{form.message}</p>
		</div>
	{/if}

	{#if data.pendingApplications.length === 0}
		<div class="rounded-2xl border-2 bg-gray-50 p-8 text-center text-gray-600">
			<p>Ingen ventende søknader</p>
		</div>
	{:else}
		<div class="grid gap-4">
			{#each data.pendingApplications as application (application.id)}
				<div class="bg-background rounded-2xl border-2 p-4 shadow-lg sm:p-6">
					<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div class="space-y-2">
							<h3 class="text-lg font-semibold">{application.name}</h3>
							<p class="text-sm text-gray-600 sm:text-base">{application.email}</p>
							<p class="text-xs text-gray-500 sm:text-sm">
								Søkte: {normalDate(application.createdAt)}
							</p>
						</div>

						<div class="flex gap-2 sm:flex-shrink-0">
							<form
								method="POST"
								action="?/approve"
								class="flex-1 sm:flex-initial"
								use:enhance={() => {
									processingId = application.id;
									return async ({ update }) => {
										await update();
										await invalidateAll();
										processingId = null;
									};
								}}
							>
								<input type="hidden" name="applicationId" value={application.id} />
								<input type="hidden" name="name" value={application.name} />
								<input type="hidden" name="email" value={application.email} />
								<input type="hidden" name="feideId" value={application.feideId} />
								<Button
									type="submit"
									intent="primary"
									size="sm"
									class="w-full sm:w-auto"
									disabled={processingId === application.id}
								>
									{processingId === application.id ? 'Behandler...' : 'Godkjenn'}
								</Button>
							</form>

							<form
								method="POST"
								action="?/deny"
								class="flex-1 sm:flex-initial"
								use:enhance={() => {
									processingId = application.id;
									return async ({ update }) => {
										await update();
										await invalidateAll();
										processingId = null;
									};
								}}
							>
								<input type="hidden" name="applicationId" value={application.id} />
								<input type="hidden" name="email" value={application.email} />
								<input type="hidden" name="feideId" value={application.feideId} />
								<Button
									type="submit"
									intent="danger"
									size="sm"
									class="w-full sm:w-auto"
									disabled={processingId === application.id}
								>
									{processingId === application.id ? 'Behandler...' : 'Avslå'}
								</Button>
							</form>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>
