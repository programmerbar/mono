<script lang="ts">
	import type { getEventBySlug } from '$lib/server/sanity/events';
	import { formatDate } from '$lib/utils/date';

	type Props = {
		event: Awaited<ReturnType<typeof getEventBySlug>>;
	};

	const { event }: Props = $props();
</script>

<aside
	class="md:max-w-[350px] w-full h-fit p-6 border-2 bg-background border-black rounded-xl shadow-xl"
>
	<ul class="space-y-8">
		<li>
			<h3 class="font-medium text-lg font-mono">Start:</h3>
			<p>{formatDate(event.start)}</p>
		</li>
		<li>
			<h3 class="font-medium text-lg font-mono">Slutt:</h3>
			<p>{formatDate(event.end)}</p>
		</li>
		<li>
			<h3 class="font-medium text-lg font-mono">Privat?:</h3>
			<p>{event.isPrivate ? 'JA' : 'NEI'}</p>
		</li>

		{#if event.registrationLink}
			<li>
				<a
					class="bg-primary rounded py-2 px-4 font-medium border-2 border-black h-10 flex justify-center items-center hover:bg-primary-light transition-colors"
					href={event.registrationLink}>Lenke til påmelding</a
				>
			</li>
		{/if}
	</ul>
</aside>
