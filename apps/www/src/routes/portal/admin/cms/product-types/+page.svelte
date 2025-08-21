<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import ButtonLink from '$lib/components/ui/ButtonLink.svelte';
	import Heading from '$lib/components/ui/Heading.svelte';
	import { Plus, Trash2, Hash, Edit } from '@lucide/svelte';

	let { data } = $props();
	let deletingId = $state<string | null>(null);
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<Heading level={1} class="text-2xl font-bold text-gray-900">Produkttyper</Heading>
			<p class="mt-1 text-sm text-gray-500">
				Administrer kategorier for produkter (øl, snacks, osv.)
			</p>
		</div>
		<ButtonLink href="/portal/admin/cms/product-types/new" class="flex items-center gap-2">
			<Plus class="h-4 w-4" />
			Ny Produkttype
		</ButtonLink>
	</div>

	<!-- Product Types List -->
	<div class="border-gray bg-background overflow-hidden rounded-2xl border-2 shadow-lg">
		{#if data.productTypes.length === 0}
			<div class="p-12 text-center">
				<Hash class="mx-auto h-12 w-12 text-gray-400" />
				<h3 class="mt-4 text-lg font-medium text-gray-900">Ingen produkttyper</h3>
				<p class="mt-2 text-sm text-gray-500">Kom i gang ved å legge til din første produkttype.</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full min-w-[500px]">
					<thead class="border-b-2 bg-gray-200">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>
								Tittel
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>
								Opprettet
							</th>
							<th
								class="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
							>
								Handlinger
							</th>
						</tr>
					</thead>
					<tbody class="border-b border-gray-100 break-words whitespace-nowrap">
						{#each data.productTypes as productType (productType.id)}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{productType.title}</div>
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
									{new Date(productType.createdAt).toLocaleDateString('no-NO')}
								</td>
								<td class="px-6 py-4 text-right whitespace-nowrap">
									<div class="flex items-center justify-end gap-2">
										<ButtonLink
											href="/portal/admin/cms/product-types/{productType.id}/edit"
											intent="outline"
										>
											<Edit class="h-4 w-4" />
										</ButtonLink>
										<form method="POST" action="?/delete" use:enhance class="inline">
											<input type="hidden" name="id" value={productType.id} />
											<Button
												type="submit"
												intent="outline"
												disabled={deletingId === productType.id}
												onclick={() => (deletingId = productType.id)}
												class="text-red-600 hover:text-red-700"
											>
												<Trash2 class="h-4 w-4" />
											</Button>
										</form>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
