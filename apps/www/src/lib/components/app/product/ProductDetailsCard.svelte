<script lang="ts">
	type DetailItem = {
		title: string;
		value: string | number | undefined;
	};

	type Props = {
		details: DetailItem[];
		class?: string;
	};

	let { details, class: className = '' }: Props = $props();
</script>

<div class="overflow-hidden rounded-xl border bg-white shadow-sm {className}">
	<h2 class="border-b bg-gray-50 px-6 py-4 text-xl font-semibold text-gray-900">Produktdetaljer</h2>
	<div class="divide-y">
		{#each details as { title, value } (title)}
			<div class="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50">
				<span class="font-medium text-gray-700">{title}</span>
				<span class="text-gray-900">{value ?? 'Ukjent'}</span>
			</div>
		{/each}
	</div>
</div>
