<script lang="ts">
	type Props = {
		id: string;
		value?: string;
		options: Array<{ value: string; label: string }>;
		label?: string;
	};

	let { id, value = $bindable(), options, label }: Props = $props();
</script>

<div class="flex flex-col gap-1">
	{#if label}
		<label for={id} class="text-foreground-secondary text-xs font-medium">{label}</label>
	{/if}
	<select {id} class="border-border bg-card-muted border px-2 py-1.5 font-mono text-sm" bind:value>
		{#each options as option (option.value)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</div>
