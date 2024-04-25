<script lang="ts">
	type Props = {
		title: string;
		postfix?: string;
		withPostfix?: boolean;
	};

	let { title, withPostfix = true, postfix = '— Programmerbar' }: Props = $props();

	let postfixText = withPostfix ? ' ' + postfix : '';
</script>

<svelte:head>
	<title>{title}{postfixText}</title>
</svelte:head>
