<script lang="ts">
	import ButtonLink from '$lib/components/ui/ButtonLink.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Heading from '$lib/components/ui/Heading.svelte';
	import { ArrowLeft, ChevronLeft, ChevronRight } from '@lucide/svelte';
	import type { PageData } from './$types';

	const formatter = new Intl.DateTimeFormat('no-NO', {
		dateStyle: 'short',
		timeStyle: 'short'
	});

	let { data }: { data: PageData } = $props();

	function formatTimestamp(value: Date | string | number) {
		const date = value instanceof Date ? value : new Date(value);
		return formatter.format(date);
	}

	function buildQuery(params: Record<string, string | number | null | undefined>) {
		const search = new URLSearchParams();

		if (data.filters?.startDate) {
			search.set('startDate', data.filters.startDate);
		}

		if (data.filters?.endDate) {
			search.set('endDate', data.filters.endDate);
		}

		for (const [key, value] of Object.entries(params)) {
			if (value === null || value === undefined || value === '') continue;
			search.set(key, String(value));
		}

		const query = search.toString();
		return query ? `?${query}` : '';
	}

	function buildDownloadUrl() {
		const search = new URLSearchParams();

		if (data.filters?.startDate) {
			search.set('startDate', data.filters.startDate);
		}

		if (data.filters?.endDate) {
			search.set('endDate', data.filters.endDate);
		}

		const query = search.toString();
		return `/portal/admin/historikk/download.csv${query ? `?${query}` : ''}`;
	}

	const pageNumbers = $derived.by(() =>
		Array.from({ length: data.pagination.pageCount }, (_, index) => index + 1)
	);

	const pageStart = $derived.by(() => {
		if (data.pagination.totalCount === 0) {
			return 0;
		}
		return (data.pagination.currentPage - 1) * data.pagination.pageSize + 1;
	});

	const pageEnd = $derived.by(() =>
		Math.min(data.pagination.currentPage * data.pagination.pageSize, data.pagination.totalCount)
	);

	const previousPage = $derived.by(() =>
		data.pagination.currentPage > 1 ? data.pagination.currentPage - 1 : null
	);

	const nextPage = $derived.by(() =>
		data.pagination.currentPage < data.pagination.pageCount ? data.pagination.currentPage + 1 : null
	);

	const hasFilters = $derived.by(() => Boolean(data.filters?.startDate || data.filters?.endDate));
</script>

<svelte:head>
	<title>Admin - Bonghistorikk</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header with back button -->
	<div class="flex items-center gap-4">
		<ButtonLink href="/portal/admin" intent="outline" size="square" aria-label="Tilbake">
			<ArrowLeft class="h-5 w-5" />
		</ButtonLink>
		<div>
			<Heading>Bonghistorikk</Heading>
			<p class="mt-1 text-gray-600">Se historikk for bruk av bong</p>
		</div>
	</div>

	<div class="rounded-lg border bg-white">
		<div class="border-b px-6 py-4">
			<h2 class="text-lg font-semibold text-gray-900">Claimede bonger</h2>
			<p class="text-sm text-gray-600">Viser de siste claimene først.</p>
		</div>
		<div class="flex flex-col gap-4 border-b px-6 py-4 lg:flex-row lg:items-end lg:justify-between">
			<form
				method="get"
				class="grid w-full gap-4 sm:grid-cols-2 lg:flex lg:flex-1 lg:flex-wrap lg:items-end"
			>
				<div class="flex flex-col gap-2">
					<label for="startDate" class="text-sm font-medium text-gray-700">Fra</label>
					<input
						id="startDate"
						type="datetime-local"
						name="startDate"
						value={data.filters?.startDate ?? ''}
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label for="endDate" class="text-sm font-medium text-gray-700">Til</label>
					<input
						id="endDate"
						type="datetime-local"
						name="endDate"
						value={data.filters?.endDate ?? ''}
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
					/>
				</div>
				<input type="hidden" name="page" value="1" />
				<div class="flex items-center gap-3 sm:col-span-2 lg:ml-auto">
					<Button type="submit" size="sm">Filtrer</Button>
					{#if hasFilters}
						<ButtonLink href="/portal/admin/historikk" intent="outline" size="sm">
							Nullstill
						</ButtonLink>
					{/if}
				</div>
			</form>
			<ButtonLink
				href={buildDownloadUrl()}
				intent="outline"
				class="w-full justify-center gap-2 lg:w-auto"
				size="sm"
			>
				Last ned CSV
			</ButtonLink>
		</div>
		{#if data.claimedCredits.length === 0}
			<div class="px-6 py-12 text-center text-gray-500">
				Det er ingen registrerte claim i databasen ennå.
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full min-w-[720px] divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr class="text-xs font-semibold uppercase tracking-wide text-gray-500">
							<th class="px-6 py-3 text-left">Dato</th>
							<th class="px-6 py-3 text-left">Bruker</th>
							<th class="px-6 py-3 text-left">E-post</th>
							<th class="px-6 py-3 text-left">Produkt-ID</th>
							<th class="px-6 py-3 text-right">Credits</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 text-sm text-gray-700">
						{#each data.claimedCredits as entry (entry.id)}
							<tr class="transition-colors hover:bg-gray-50">
								<td class="whitespace-nowrap px-6 py-4">
									{formatTimestamp(entry.createdAt)}
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									{entry.user?.name ?? 'Ukjent bruker'}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-gray-500">
									{entry.user?.altEmail ?? entry.user?.email ?? 'Ukjent'}
								</td>
								<td class="whitespace-nowrap px-6 py-4 font-mono text-xs text-gray-500">
									{entry.productId}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-right text-gray-900">
									{entry.creditCost}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div
				class="flex flex-col gap-4 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
			>
				<p class="text-sm text-gray-600">
					Viser {pageStart}
					{#if data.pagination.totalCount > 0}
						–{pageEnd}
					{/if}
					av {data.pagination.totalCount}
				</p>
				<nav aria-label="Paginering" class="flex items-center gap-2">
					{#if previousPage}
						<ButtonLink
							href={buildQuery({ page: previousPage })}
							intent="outline"
							size="sm"
							class="gap-1"
						>
							<ChevronLeft class="h-4 w-4" />
							Forrige
						</ButtonLink>
					{:else}
						<span
							class="flex items-center gap-1 rounded-lg border border-dashed bg-gray-50 px-3 py-1.5 text-sm text-gray-400"
						>
							<ChevronLeft class="h-4 w-4" />
							Forrige
						</span>
					{/if}

					{#each pageNumbers as page (page)}
						{#if page === data.pagination.currentPage}
							<span
								class="border-primary-dark bg-primary rounded-lg border px-3 py-1.5 text-sm font-medium text-white"
							>
								{page}
							</span>
						{:else}
							<ButtonLink href={buildQuery({ page })} intent="outline" size="sm">
								{page}
							</ButtonLink>
						{/if}
					{/each}

					{#if nextPage}
						<ButtonLink
							href={buildQuery({ page: nextPage })}
							intent="outline"
							size="sm"
							class="gap-1"
						>
							Neste
							<ChevronRight class="h-4 w-4" />
						</ButtonLink>
					{:else}
						<span
							class="flex items-center gap-1 rounded-lg border border-dashed bg-gray-50 px-3 py-1.5 text-sm text-gray-400"
						>
							Neste
							<ChevronRight class="h-4 w-4" />
						</span>
					{/if}
				</nav>
			</div>
		{/if}
	</div>
</div>
