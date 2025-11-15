<script lang="ts">
	import type { Happening } from '$lib/api/sanity/echo-cms';
	import { formatDate } from '$lib/utils/date';
	import { resolve } from '$app/paths';

	type Props = {
		events: Array<Happening>;
	};

	let { events }: Props = $props();

	function getDayOfWeek(date: string): string {
		const d = new Date(date);
		const days = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
		return days[d.getDay()];
	}

	function getDayNumber(date: string): string {
		const d = new Date(date);
		return d.getDate().toString();
	}

	function getMonth(date: string): string {
		const d = new Date(date);
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
		return months[d.getMonth()];
	}
</script>

<div class="bg-background rounded-2xl border-2 p-6 md:p-8">
	<h2 class="mb-8 font-mono text-3xl font-medium md:text-4xl">Arrangementer</h2>

	<ul class="flex flex-col gap-4 overflow-hidden">
		{#each events as event (`${event.slug}${event.date}`)}
			{@const { title, date, slug } = event}
			<li class="group">
				<a href={resolve('/(app)/arrangement/[slug]', { slug })} class="block">
					<div
						class="relative overflow-hidden rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 transition-all duration-300 hover:border-gray-300"
					>
						<div class="flex items-center gap-4">
							<!-- Date Badge -->
							<div
								class="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-white"
							>
								<span class="text-xs font-semibold uppercase leading-tight">{getDayOfWeek(date)}</span>
								<span class="text-2xl font-bold leading-none">{getDayNumber(date)}</span>
								<span class="text-xs font-medium leading-tight">{getMonth(date)}</span>
							</div>

							<!-- Event Info -->
							<div class="min-w-0 flex-1">
								<h3
									class="mb-2 text-lg font-bold leading-tight text-gray-900 transition-colors duration-200 group-hover:text-gray-700"
								>
									{title}
								</h3>
								<div class="flex items-center gap-2 text-sm text-gray-600">
									<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									<span class="font-mono font-medium">{formatDate(date)}</span>
								</div>
							</div>

							<!-- Arrow -->
							<div class="shrink-0 text-gray-300 transition-colors duration-200 group-hover:text-gray-500">
								<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
				<div class="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center">
					<svg
						class="mx-auto mb-4 h-12 w-12 text-gray-300"
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
					<p class="text-lg font-semibold text-gray-600">Ingen kommende arrangementer</p>
					<p class="mt-2 text-sm text-gray-500">
						Følg med på våre sosiale medier for oppdateringer
					</p>
				</div>
			</li>
		{/each}
	</ul>
</div>
