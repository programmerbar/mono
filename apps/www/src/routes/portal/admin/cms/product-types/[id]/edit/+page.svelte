<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import ProductTypeForm from '$lib/components/cms/ProductTypeForm.svelte';
	import { ArrowLeft, Hash } from '@lucide/svelte';

	let { data } = $props();
</script>

<div class="space-y-6">
	<!-- Breadcrumb -->
	<div class="flex items-center gap-2 text-sm">
		<a
			href="/portal/admin/cms/product-types"
			class="flex items-center gap-1 text-blue-600 hover:text-blue-700"
		>
			<ArrowLeft class="h-4 w-4" />
			Produkttyper
		</a>
		<span class="text-gray-500">/</span>
		<span class="text-gray-900">Rediger Produkttype</span>
	</div>

	<!-- Header -->
	<div class="flex items-center gap-3">
		<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
			<Hash class="h-6 w-6 text-blue-600" />
		</div>
		<div>
			<Heading level={1} class="text-2xl font-bold text-gray-900">Rediger Produkttype</Heading>
			<p class="text-sm text-gray-500">
				Oppdater informasjon om {data.productType?.title || 'produkttype'}
			</p>
		</div>
	</div>

	<!-- Form -->
	<ProductTypeForm productType={data.productType} isUpdate />
</div>
