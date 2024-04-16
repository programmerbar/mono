<script lang="ts">
	import type { getEventBySlug } from '$lib/server/sanity/events';
	import { formatDate, time } from '$lib/utils/date';

	type Props = {
		event: Awaited<ReturnType<typeof getEventBySlug>>;
	};

	const { event }: Props = $props();
</script>

<aside class="w-full md:max-w-[350px] space-y-4">
	{#if event.isPrivate}
		<div class="bg-red-500 text-white p-4 rounded-xl border-2 border-black shadow-xl">
			<p class="font-medium text-center">Dette arrangementet er privat</p>
		</div>
	{/if}

	<div class="-full h-fit p-6 border-2 bg-background border-black rounded-xl shadow-xl">
		<ul class="space-y-8">
			<li>
				<h3 class="font-medium text-lg font-mono">Tidspunkt:</h3>
				<p>Fra {time(event.start)} til {time(event.end)}</p>
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
	</div>
</aside>
