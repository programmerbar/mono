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

<div class="border-border bg-card overflow-hidden border-2 font-mono {className}">
	<h2
		class="border-border bg-card-muted text-foreground-primary border-b px-6 py-4 text-xl font-semibold"
	>
		## Produktdetaljer
	</h2>
	<div class="divide-border divide-y">
		{#each details as { title, value } (title)}
			<div
				class="hover:bg-card-hover flex items-center justify-between px-6 py-4 transition-colors"
			>
				<span class="text-foreground-secondary font-medium">{title}</span>
				<span class="text-foreground-primary">{value ?? 'Ukjent'}</span>
			</div>
		{/each}
	</div>
</div>
