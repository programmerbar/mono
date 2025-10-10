<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import ProductTypeForm from '$lib/components/portal/cms/ProductTypeForm.svelte';
	import { ArrowLeft, Hash } from '@lucide/svelte';
	import { resolve } from '$app/paths';
</script>

<div class="space-y-6">
	<!-- Breadcrumb -->
	<div class="flex items-center gap-2 text-sm">
		<a
			href={resolve('/portal/admin/cms/product-types')}
			class="flex items-center gap-1 text-blue-600 hover:text-blue-700"
		>
			<ArrowLeft class="h-4 w-4" />
			Produkttyper
		</a>
		<span class="text-gray-500">/</span>
		<span class="text-gray-900">Ny Produkttype</span>
	</div>

	<!-- Header -->
	<div class="flex items-center gap-3">
		<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
			<Hash class="h-6 w-6 text-blue-600" />
		</div>
		<div>
			<Heading level={1} class="text-2xl font-bold text-gray-900">Ny Produkttype</Heading>
			<p class="text-sm text-gray-500">Legg til en ny kategori for produkter</p>
		</div>
	</div>

	<!-- Form -->
	<ProductTypeForm productType={{ title: '' }} />
</div>
