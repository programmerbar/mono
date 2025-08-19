<script lang="ts">
	import type { Happening } from '$lib/api/sanity/events';
	import { formatDate } from '$lib/date';

	type Props = {
		events: Array<Happening>;
	};

	let { events }: Props = $props();
</script>

<div class="bg-background rounded-2xl border-2 p-6 shadow-lg">
	<h2 class="mb-6 text-center font-mono text-3xl font-medium md:text-4xl">Arrangementer</h2>

	<ul class="flex flex-col gap-3 overflow-hidden">
		{#each events as { title, date, slug } (slug)}
			<li class="group">
				<a href={`/arrangement/${slug}`} class="block">
					<div
						class="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all duration-300"
					>
						<div class="flex items-center justify-between">
							<div class="min-w-0 flex-1">
								<h3
									class="group-hover:text-primary mb-1 text-lg leading-tight font-semibold text-gray-900 transition-colors duration-200"
								>
									{title}
								</h3>
								<p class="flex items-center gap-2 font-mono text-sm font-medium text-gray-600">
									<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									{formatDate(date)}
								</p>
							</div>
							<div
								class="group-hover:text-primary ml-4 text-gray-400 transition-colors duration-200"
							>
								<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</div>
						</div>
					</div>
				</a>
			</li>
		{:else}
			<li>
				<div class="text-center py-8">
					<svg
						class="mx-auto h-12 w-12 text-gray-300 mb-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<p class="text-lg font-medium text-gray-500">Ingen kommende arrangementer</p>
					<p class="text-sm text-gray-400 mt-1">
						Følg med på våre sosiale medier for oppdateringer
					</p>
				</div>
			</li>
		{/each}
	</ul>
</div>
