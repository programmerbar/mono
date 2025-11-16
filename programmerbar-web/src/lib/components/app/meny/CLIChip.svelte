<script lang="ts">
	type Props = {
		label: string;
		class?: string;
	};

	let { label, class: className = '' }: Props = $props();
</script>

<span
	class="border-border bg-card-muted text-foreground-secondary inline-block border px-2 py-0.5 font-mono text-xs {className}"
>
	{label}
</span>
