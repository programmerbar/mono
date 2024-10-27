<script lang="ts">
	type Props = {
		to: string;
		name: string;
	};

	let { to, name }: Props = $props();
</script>

<li class="flex w-full font-mono text-left hover:bg-gray-100">
	<a class="hover:underline w-full py-2 px-4 text-gray-700 text-3xl font-medium" href={to}>{name}</a
	>
</li>
