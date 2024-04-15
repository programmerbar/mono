<script lang="ts">
	type Props = {
		text: string;
	};

	const { text }: Props = $props();
</script>

<svelte:element this="p" class="mt-4 text-gray-800 text-lg leading-8">
	{text}
</svelte:element>
