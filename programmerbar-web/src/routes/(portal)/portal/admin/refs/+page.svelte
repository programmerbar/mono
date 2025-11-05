<script lang="ts">
	import ButtonLink from '$lib/components/ui/ButtonLink.svelte';
	import Heading from '$lib/components/ui/Heading.svelte';
	import { UserPlus, ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { SvelteSet, SvelteURLSearchParams } from 'svelte/reactivity';

	const formatter = new Intl.DateTimeFormat('no-NO', {
		dateStyle: 'short',
		timeStyle: 'short'
	});

	let { data } = $props();

	function formatTimestamp(value: Date | string | number | null | undefined) {
		if (!value) return '-';
		const date = value instanceof Date ? value : new Date(value);
		return formatter.format(date);
	}

	function buildQuery(params: Record<string, string | number | null | undefined>) {
		const search = new SvelteURLSearchParams();

		for (const [key, value] of Object.entries(params)) {
			if (value === null || value === undefined || value === '') continue;
			search.set(key, String(value));
		}

		const query = search.toString();
		return query ? `?${query}` : '';
	}

	function getStatusBadge(status: string) {
		switch (status) {
			case 'completed':
				return {
					label: 'Fullført',
					class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
				};
			case 'pending':
				return {
					label: 'Venter',
					class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
				};
			case 'expired':
				return {
					label: 'Utløpt',
					class: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
				};
			default:
				return { label: status, class: '' };
		}
	}

	type PaginationItem = { type: 'page'; value: number } | { type: 'ellipsis'; key: string };

	const paginationItems = $derived.by(() => {
		const { currentPage, pageCount } = data.pagination;
		if (pageCount <= 0) {
			return [];
		}

		const pages = new SvelteSet<number>();

		pages.add(1);
		if (pageCount > 1) {
			pages.add(pageCount);
		}
		if (pageCount > 2) {
			pages.add(pageCount - 1);
		}

		for (let offset = -2; offset <= 2; offset += 1) {
			const candidate = currentPage + offset;
			if (candidate > 1 && candidate < pageCount) {
				pages.add(candidate);
			}
		}

		const sortedPages = Array.from(pages)
			.filter((page) => page >= 1 && page <= pageCount)
			.sort((a, b) => a - b);

		const items: Array<PaginationItem> = [];

		for (let index = 0; index < sortedPages.length; index += 1) {
			const page = sortedPages[index];
			const previous = sortedPages[index - 1];

			if (index > 0 && page - previous > 1) {
				items.push({ type: 'ellipsis', key: `ellipsis-${previous}-${page}` });
			}

			items.push({ type: 'page', value: page });
		}

		return items;
	});

	const previousPage = $derived.by(() =>
		data.pagination.currentPage > 1 ? data.pagination.currentPage - 1 : null
	);

	const nextPage = $derived.by(() =>
		data.pagination.currentPage < data.pagination.pageCount ? data.pagination.currentPage + 1 : null
	);
</script>

<svelte:head>
	<title>Admin - Referrals</title>
</svelte:head>

<div class="space-y-10">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<UserPlus class="h-6 w-6 text-gray-600 dark:text-gray-300" />
		<div>
			<Heading>Referrals</Heading>
			<p class="mt-1 text-gray-600 dark:text-gray-300">
				Oversikt over alle referrals i systemet
			</p>
		</div>
	</div>

	<div class="bg-portal-card border-portal-border rounded-lg border">
		<div class="border-portal-border border-b px-6 py-4">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Alle referrals</h2>
			<p class="text-sm text-gray-600 dark:text-gray-300">
				Viser {data.referrals.length} av {data.pagination.totalCount} totalt.
			</p>
		</div>
		{#if data.referrals.length === 0}
			<div class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
				Det er ingen registrerte referrals i databasen ennå.
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="divide-portal-border w-full min-w-[720px] divide-y divide-gray-200">
					<thead class="dark:bg-portal-hover bg-gray-50">
						<tr
							class="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400"
						>
							<th class="px-6 py-3 text-left">Opprettet</th>
							<th class="px-6 py-3 text-left">Referrer</th>
							<th class="px-6 py-3 text-left">Referee</th>
							<th class="px-6 py-3 text-left">Status</th>
							<th class="px-6 py-3 text-left">Fullført</th>
						</tr>
					</thead>
					<tbody
						class="divide-portal-border divide-y divide-gray-200 text-sm text-gray-700 dark:text-gray-300"
					>
						{#each data.referrals as referral (referral.id)}
							{@const statusBadge = getStatusBadge(referral.status)}
							<tr class="hover:bg-portal-hover transition-colors">
								<td class="px-6 py-4 whitespace-nowrap">
									{formatTimestamp(referral.createdAt)}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									{referral.referrer?.name ?? 'Ukjent bruker'}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									{referral.referred?.name ?? 'Ukjent bruker'}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span
										class="inline-flex rounded-full px-2 py-1 text-xs font-semibold {statusBadge.class}"
									>
										{statusBadge.label}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
									{formatTimestamp(referral.completedAt)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="border-portal-border flex justify-center border-t px-6 py-4">
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
							class="border-portal-border dark:bg-portal-hover flex items-center gap-1 rounded-lg border border-dashed bg-gray-50 px-3 py-1.5 text-sm text-gray-400 dark:text-gray-500"
						>
							<ChevronLeft class="h-4 w-4" />
							Forrige
						</span>
					{/if}

					{#each paginationItems as item (item.type === 'page' ? item.value : item.key)}
						{#if item.type === 'ellipsis'}
							<span class="px-2 text-sm text-gray-400 dark:text-gray-500">…</span>
						{:else if item.value === data.pagination.currentPage}
							<span
								class="border-primary-dark bg-primary dark:border-primary-dark dark:bg-primary rounded-lg border px-3 py-1.5 text-sm font-medium text-white"
							>
								{item.value}
							</span>
						{:else}
							<ButtonLink href={buildQuery({ page: item.value })} intent="outline" size="sm">
								{item.value}
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
							class="border-portal-border dark:bg-portal-hover flex items-center gap-1 rounded-lg border border-dashed bg-gray-50 px-3 py-1.5 text-sm text-gray-400 dark:text-gray-500"
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
