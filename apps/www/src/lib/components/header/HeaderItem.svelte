<script lang="ts">
	type Props = {
		to: string;
		name: string;
	};

	let { to, name }: Props = $props();
</script>

<li class="font-mono">
	<a class="hover:underline text-gray-700 text-xl font-semibold" href={to}>{name}</a>
</li>
