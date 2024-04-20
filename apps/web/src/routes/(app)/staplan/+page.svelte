<script lang="ts">
	import { formatDate, time } from '$lib/utils/date';
	import { joinHuman } from '$lib/utils/list';

	let { data } = $props();
	let { standPlan } = data;
</script>

<main>
	<h1 class="text-4xl font-medium font-mono mb-8">Ståplan</h1>

	{#each standPlan as stand}
		<div class="flex flex-col">
			<p>
				Når: {formatDate(stand.start)}, kl {time(stand.start)} - {formatDate(stand.end)}, kl {time(
					stand.end
				)}
			</p>

			<p>Personer: {joinHuman(stand.members.map((member) => member.name))}</p>
		</div>
	{/each}
</main>
