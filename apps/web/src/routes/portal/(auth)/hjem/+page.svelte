<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';

	let { data } = $props();
	let { user, upcomingShifts } = data;
</script>

<SEO title="Hjem" />

<h1>Velkommen tilbake, {user.name}</h1>

<div>
	{#each upcomingShifts as shift}
		<div>
			<p>{shift.start} - {shift.end}</p>
		</div>
	{:else}
		<p>Du har ingen vakter</p>
	{/each}
</div>
