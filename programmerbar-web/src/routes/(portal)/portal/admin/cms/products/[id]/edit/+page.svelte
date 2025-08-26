<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import ProductForm from '$lib/components/portal/cms/ProductForm.svelte';
	import { ArrowLeft, Package } from '@lucide/svelte';

	let { data } = $props();
</script>

<div class="space-y-6">
	<!-- Breadcrumb -->
	<div class="flex items-center gap-2 text-sm">
		<a
			href="/portal/admin/cms/products"
			class="flex items-center gap-1 text-blue-600 hover:text-blue-700"
		>
			<ArrowLeft class="h-4 w-4" />
			Produkter
		</a>
		<span class="text-gray-500">/</span>
		<span class="text-gray-900">Rediger Produkt</span>
	</div>

	<!-- Header -->
	<div class="flex items-center gap-3">
		<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
			<Package class="h-6 w-6 text-blue-600" />
		</div>
		<div>
			<Heading level={1} class="text-2xl font-bold text-gray-900">Rediger Produkt</Heading>
			<p class="text-sm text-gray-500">Oppdater informasjon om {data.product?.name || 'produkt'}</p>
		</div>
	</div>

	<!-- Form -->
	<ProductForm
		product={{
			id: data.product.id,
			name: data.product.name,
			description: data.product.description ?? null,
			sku: data.product.sku ?? null,
			ordinaryPrice: data.product.ordinaryPrice,
			studentPrice: data.product.studentPrice,
			internalPrice: data.product.internalPrice,
			credits: data.product.credits,
			volume: data.product.volume,
			alcoholContent: data.product.alcoholContent,
			variants: data.product.variants ?? null,
			producerId: data.product.producerId ?? null,
			imageId: data.product.imageId || null,
			isSoldOut: data.product.isSoldOut ?? false,
			productTypeIds: data.product.productTypeIds || []
		}}
		producers={data.producers}
		productTypes={data.productTypes}
		isUpdate
	/>
</div>
