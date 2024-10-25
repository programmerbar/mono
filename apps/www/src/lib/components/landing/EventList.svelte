<script lang="ts">
	import type { Happening } from '$lib/api/sanity/events';
	import { formatDate } from '$lib/date';

	type Props = {
		events: Array<Happening>;
	};

	let { events }: Props = $props();
</script>

<div class="rounded-xl border-2 bg-background p-2 shadow-md">
	<h2 class="py-6 text-center font-mono text-3xl font-medium md:text-4xl">Arrangementer</h2>

	<ul class="flex flex-col divide-y overflow-hidden">
		{#each events as { title, date, slug }}
			<li class="py-1">
				<a href={`/arrangement/${slug}`} class="group overflow-hidden text-xl">
					<div
						class="flex h-16 flex-col justify-center rounded-xl px-4 py-2 transition-all hover:bg-primary-light"
					>
						<p class="group-hover:underline">{title}</p>
						<p class="font-mono text-sm font-medium text-gray-700">{formatDate(date)}</p>
					</div>
				</a>
			</li>
		{:else}
			<li>
				<p class="p-2 text-center text-lg font-medium">Ingen kommende arrangementer</p>
			</li>
		{/each}
	</ul>
</div>
