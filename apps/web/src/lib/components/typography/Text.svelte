<script lang="ts">
	type Props = {
		text: string;
	};

	const { text }: Props = $props();
</script>

<svelte:element this="p" class="mt-2 text-gray-800 text-lg">
	{text}
</svelte:element>
