<script lang="ts">
	import type { Happening } from '$lib/api/sanity/echo-cms';
	import { formatDate } from '$lib/utils/date';
	import { resolve } from '$app/paths';
	import CLIWindow from '$lib/components/app/CLIWindow.svelte';

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
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'Mai',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Okt',
			'Nov',
			'Des'
		];
		return months[d.getMonth()];
	}
</script>

<CLIWindow title="ls -la arrangementer/">
	<!-- Window Content -->
	<div class="flex-1 p-6 md:p-8">
		<ul class="flex flex-col gap-4 overflow-hidden">
			{#each events as event (`${event.slug}${event.date}`)}
				{@const { title, date, slug } = event}
				<li class="group">
					<a href={resolve('/(app)/arrangement/[slug]', { slug })} class="block">
						<div
							class="border-primary bg-card-muted hover:border-primary-dark hover:bg-card-hover border-l-4 p-4 font-mono transition-all duration-300"
						>
							<div class="flex items-center gap-4">
								<!-- Date Badge -->
								<div
									class="border-primary bg-primary flex h-16 w-16 shrink-0 flex-col items-center justify-center border-2 text-white"
								>
									<span class="text-xs leading-tight font-medium uppercase"
										>{getDayOfWeek(date)}</span
									>
									<span class="text-xl leading-none font-bold">{getDayNumber(date)}</span>
									<span class="text-xs leading-tight font-medium">{getMonth(date)}</span>
								</div>

								<!-- Event Info -->
								<div class="min-w-0 flex-1">
									<h3
										class="text-foreground-primary group-hover:text-primary mb-2 text-base leading-tight font-medium transition-colors duration-200"
									>
										{title}
									</h3>
									<div class="text-foreground-secondary flex items-center gap-2 text-sm">
										<span class="text-foreground-muted">[</span>
										<span>{formatDate(date)}</span>
										<span class="text-foreground-muted">]</span>
									</div>
								</div>

								<!-- Arrow -->
								<div class="text-foreground-muted shrink-0">
									<span class="text-sm">></span>
								</div>
							</div>
						</div>
					</a>
				</li>
			{:else}
				<li>
					<div class="border-l-4 border-border bg-card-muted py-12 px-4 text-center font-mono">
						<p class="text-foreground-muted">$ ls arrangementer/</p>
						<p class="mt-2 text-sm text-foreground-secondary">
							ls: cannot access 'arrangementer/': No such file or directory
						</p>
						<p class="mt-4 text-sm text-foreground-muted">
							<span class="text-foreground-subtle">#</span> Følg med på våre sosiale medier for oppdateringer
						</p>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</CLIWindow>
