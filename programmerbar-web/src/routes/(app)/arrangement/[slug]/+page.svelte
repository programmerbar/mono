<script lang="ts">
	import { formatDate } from '$lib/date';
	import { marked } from 'marked';
	import { toast } from 'svelte-sonner';
	import { Calendar, Share2, ExternalLink } from '@lucide/svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ButtonLink from '$lib/components/ui/ButtonLink.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data } = $props();

	let shareText = $state('Del arrangementet');

	let html = marked.parse(data.event.body ?? '');

	function handleShare() {
		if (navigator.share) {
			navigator.share({ title: data.event.title, url: window.location.href });
		} else {
			navigator.clipboard.writeText(window.location.href);
			toast.success('Lenken er kopiert til utklippstavlen!');
			shareText = 'Lenken er kopiert!';
			setTimeout(() => {
				shareText = 'Del arrangementet';
			}, 2000);
		}
	}

	// SEO data
	const eventDescription =
		data.event.body?.slice(0, 160) ||
		`${data.event.title} - Arrangement hos Programmerbar den ${formatDate(data.event.date)}`;
</script>

<SEO
	title={data.event.title}
	description={eventDescription}
	keywords={`${data.event.title}, arrangement, event, programmerbar, ${formatDate(data.event.date)}`}
	canonical={`/arrangement/${data.event.slug}`}
	type="event"
	publishedTime={data.event._createdAt ?? undefined}
/>

<h1 class="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
	{data.event.title}
</h1>

<main class="grid gap-8 lg:grid-cols-3 lg:gap-12">
	<!-- Main Content -->
	<div class="lg:col-span-2">
		<article class="bg-background overflow-hidden rounded-2xl border-2 shadow-xl">
			<div class="px-8 py-10">
				<div
					class="prose prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:space-y-2 prose-li:leading-relaxed max-w-none font-sans"
				>
					{@html html}
				</div>
			</div>
		</article>
	</div>

	<!-- Sidebar -->
	<aside class="space-y-6">
		<!-- Event Details Card -->
		<div class="bg-background sticky top-6 overflow-hidden rounded-2xl border-2 shadow-xl">
			<div class="px-6 py-4">
				<h2 class="flex items-center gap-2 font-bold text-gray-900">Arrangementinfo</h2>
			</div>
			<div class="p-6">
				<div class="space-y-6">
					<div class="flex items-center gap-4">
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
							<Calendar class="h-5 w-5 text-blue-600" />
						</div>
						<div>
							<h3 class="font-semibold text-gray-900">Dato og tid</h3>
							<p class="font-mono text-gray-700">{formatDate(data.event.date)}</p>
						</div>
					</div>

					<div class="flex flex-col gap-4 border-t pt-6">
						<ButtonLink
							href={`https://echo.uib.no/arrangement/${data.event.slug}`}
							class="w-full gap-2"
						>
							{#if data.event.registrationStart}
								Til påmelding
							{:else}
								Se på echo.uib.no
							{/if}
							<ExternalLink class="h-4 w-4" />
						</ButtonLink>

						<Button class="w-full gap-2" onclick={handleShare}>
							<Share2 class="h-4 w-4" />
							{shareText}
						</Button>
					</div>
				</div>
			</div>
		</div>
	</aside>
</main>
