<script lang="ts">
	import Heading from '$lib/components/ui/Heading.svelte';
	import ProducerForm from '$lib/components/portal/cms/ProducerForm.svelte';
	import { ArrowLeft, Factory } from '@lucide/svelte';

	let { data } = $props();
</script>

<div class="space-y-6">
	<!-- Breadcrumb -->
	<div class="flex items-center gap-2 text-sm">
		<a
			href="/portal/admin/cms/producers"
			class="flex items-center gap-1 text-blue-600 hover:text-blue-700"
		>
			<ArrowLeft class="h-4 w-4" />
			Produsenter
		</a>
		<span class="text-gray-500">/</span>
		<span class="text-gray-900">Ny Produsent</span>
	</div>

	<!-- Header -->
	<div class="flex items-center gap-3">
		<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
			<Factory class="h-6 w-6 text-blue-600" />
		</div>
		<div>
			<Heading level={1} class="text-2xl font-bold text-gray-900">Ny Produsent</Heading>
			<p class="text-sm text-gray-500">Legg til en ny øl- eller produktprodusent</p>
		</div>
	</div>

	<!-- Form -->
	<ProducerForm producer={{ id: data.producerId, name: '', imageId: null }} />
</div>
