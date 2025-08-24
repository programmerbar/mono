<script lang="ts">
	type Props = {
		to: string;
		name: string;
	};

	let { to, name }: Props = $props();
</script>

<li class="flex w-full text-left font-mono hover:bg-gray-100">
	<a class="w-full px-4 py-2 text-3xl font-medium text-gray-700 hover:underline" href={to}>{name}</a
	>
</li>
