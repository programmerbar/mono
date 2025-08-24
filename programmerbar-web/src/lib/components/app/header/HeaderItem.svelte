<script lang="ts">
	type Props = {
		to: string;
		name: string;
	};

	let { to, name }: Props = $props();
</script>

<li class="font-mono">
	<a class="text-xl font-semibold text-gray-700 hover:underline" href={to}>{name}</a>
</li>
