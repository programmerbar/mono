<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import ButtonLink from '$lib/components/ui/ButtonLink.svelte';
	import Heading from '$lib/components/ui/Heading.svelte';
	import Chip from '$lib/components/ui/Chip.svelte';
	import { Plus, Trash2, Package, Edit } from '@lucide/svelte';

	let { data } = $props();
	let deletingId = $state<string | null>(null);
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<Heading level={1} class="text-2xl font-bold text-gray-900">Produkter</Heading>
			<p class="mt-1 text-sm text-gray-500">Administrer øl, snacks og andre produkter</p>
		</div>
		<ButtonLink href="/portal/admin/cms/products/new" class="flex items-center gap-2">
			<Plus class="h-4 w-4" />
			Nytt Produkt
		</ButtonLink>
	</div>

	<!-- Products List -->
	<div class="border-gray bg-background overflow-hidden rounded-2xl border-2 shadow-lg">
		{#if data.products.length === 0}
			<div class="p-12 text-center">
				<Package class="mx-auto h-12 w-12 text-gray-400" />
				<h3 class="mt-4 text-lg font-medium text-gray-900">Ingen produkter</h3>
				<p class="mt-2 text-sm text-gray-500">Kom i gang ved å legge til ditt første produkt.</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full min-w-[800px]">
					<thead class="border-b-2 bg-gray-200">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>
								Produkt
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>
								Produsent
							</th>
							<th
								class="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
							>
								Handlinger
							</th>
						</tr>
					</thead>
					<tbody class="border-b border-gray-100 break-words whitespace-nowrap">
						{#each data.products as product (product.id)}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4">
									<div class="flex items-center gap-3">
										{#if product.imageId}
											<div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
												<img
													src="/api/images/{product.imageId}"
													alt={product.name}
													class="h-full w-full object-cover"
												/>
											</div>
										{:else}
											<div
												class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100"
											>
												<Package class="h-6 w-6 text-gray-400" />
											</div>
										{/if}
										<div>
											<div class="text-sm font-medium text-gray-900">{product.name}</div>
											{#if product.types && product.types.length > 0}
												<div class="mt-1 flex flex-wrap gap-1">
													{#each product.types as type (type.id)}
														<Chip label={type.title} />
													{/each}
												</div>
											{/if}
										</div>
									</div>
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
									{product.producer?.name || '-'}
								</td>
								<td class="px-6 py-4 text-right whitespace-nowrap">
									<div class="flex items-center justify-end gap-2">
										<ButtonLink
											href="/portal/admin/cms/products/{product.id}/edit"
											intent="outline"
										>
											<Edit class="h-4 w-4" />
										</ButtonLink>
										<form method="POST" action="?/delete" use:enhance class="inline">
											<input type="hidden" name="id" value={product.id} />
											<Button
												type="submit"
												intent="outline"
												disabled={deletingId === product.id}
												onclick={() => (deletingId = product.id)}
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
