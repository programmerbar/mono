<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Pill from '$lib/components/ui/Pill.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { normalDate } from '$lib/date';
	import { UserCheck, Mail, Calendar, FileUser, CheckCircle2, XCircle } from '@lucide/svelte';

	let { data, form } = $props();

	let processingId = $state<string | null>(null);
</script>

<svelte:head>
	<title>Admin - Søkere</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-3">
		<FileUser class="h-6 w-6 text-gray-600" />
		<div>
			<Heading>Frivillig-søknader</Heading>
			<p class="mt-1 text-gray-600">Behandle søknader fra nye frivillige</p>
		</div>
		{#if data.pendingApplications.length > 0}
			<div class="ml-auto">
				<Pill variant="blue">{data.pendingApplications.length} ventende</Pill>
			</div>
		{/if}
	</div>

	<!-- Success Message -->
	{#if form?.success}
		<div class="rounded-lg border border-green-200 bg-green-50 p-4">
			<div class="flex items-center gap-2">
				<CheckCircle2 class="h-4 w-4 text-green-600" />
				<p class="font-medium text-green-800">{form.message}</p>
			</div>
		</div>
	{/if}

	<!-- Applications List -->
	{#if data.pendingApplications.length === 0}
		<div class="rounded-lg border bg-white">
			<div class="p-12 text-center">
				<UserCheck class="mx-auto mb-4 h-12 w-12 text-gray-300" />
				<h3 class="mb-2 text-lg font-medium text-gray-500">Ingen ventende søknader</h3>
				<p class="text-sm text-gray-400">Nye frivillig-søknader vil vises her når de kommer inn</p>
			</div>
		</div>
	{:else}
		<div class="divide-y rounded-lg border bg-white">
			{#each data.pendingApplications as application (application.id)}
				<div class="p-6">
					<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
						<!-- Application Info -->
						<div class="flex-1 space-y-3">
							<div class="flex items-start gap-3">
								<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
									<UserCheck class="h-5 w-5 text-blue-600" />
								</div>
								<div>
									<h3 class="text-lg font-semibold text-gray-900">{application.name}</h3>
									<div class="mt-1 flex items-center gap-2">
										<Mail class="h-4 w-4 text-gray-400" />
										<span class="text-sm text-gray-600">{application.email}</span>
									</div>
									<div class="mt-1 flex items-center gap-2">
										<Calendar class="h-4 w-4 text-gray-400" />
										<span class="text-xs text-gray-500">
											Søkte {normalDate(application.createdAt)}
										</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Action Buttons -->
						<div class="flex gap-3 sm:flex-shrink-0">
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
									class="flex w-full items-center gap-2 sm:w-auto"
									disabled={processingId === application.id}
								>
									<CheckCircle2 class="h-4 w-4" />
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
									class="flex w-full items-center gap-2 sm:w-auto"
									disabled={processingId === application.id}
								>
									<XCircle class="h-4 w-4" />
									{processingId === application.id ? 'Behandler...' : 'Avslå'}
								</Button>
							</form>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
