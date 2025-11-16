<script lang="ts">
	import { echoUrlFor } from '$lib/api/sanity/echo-cms';
	import SEO from '$lib/components/SEO.svelte';
	import CLIWindow from '$lib/components/app/CLIWindow.svelte';

	const { data } = $props();
	const programmerbar = $derived(data.programmerbar);
</script>

<SEO
	title="Om oss"
	description="Lær mer om Programmerbar - studentbaren for informatikkstudenter på Universitet i Bergen."
	keywords="om oss, programmerbar, styremedlemmer, historie, studentbar, informatikkstudenter"
	canonical="/om-oss"
	type="website"
/>

<CLIWindow title="cat om-oss.txt" class="mx-auto w-full max-w-5xl">
	<!-- Window Content -->
	<div class="flex-1 p-6 md:p-8">
		<div class="mb-12">
			{#if programmerbar.image}
				<div
					class="border-border mb-4 flex h-72 w-full items-center justify-center border-2 sm:float-right sm:mb-4 sm:ml-4 md:w-96"
				>
					<img
						src={echoUrlFor(programmerbar.image).url()}
						alt="Programmerbar"
						class="h-full w-full object-cover"
					/>
				</div>
			{/if}

			<h2 class="text-foreground-primary mb-6 text-2xl font-semibold">## Programmerbar</h2>

			<article class="markdown-content text-foreground-primary">
				{@html data.html}
			</article>
		</div>

		<section class="border-border border-t-2 pt-8">
			<h2 class="text-foreground-primary mb-6 text-2xl font-semibold">## Styremedlemmer</h2>

			<ul class="text-foreground-primary grid grid-cols-1 gap-6 md:grid-cols-2">
				{#each programmerbar.members as member (member.profile._id)}
					<li class="border-border flex items-start gap-4 border-l-4 pl-4">
						<div class="shrink-0">
							{#if member.profile.picture}
								<img
									src={echoUrlFor(member.profile.picture).width(200).height(200).url()}
									alt={member.profile.name}
									class="border-border size-16 border-2 object-cover"
								/>
							{:else}
								<div
									class="border-border bg-card-muted flex size-16 flex-col items-center justify-center border-2"
								>
									<p class="text-foreground-muted text-sm font-semibold">404</p>
								</div>
							{/if}
						</div>

						<div class="min-w-0 flex-1">
							<h3 class="text-foreground-primary text-lg font-semibold">- {member.profile.name}</h3>
							{#if member.role}
								<p class="text-foreground-secondary mt-1 text-sm">{member.role}</p>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		</section>
	</div>
</CLIWindow>

<style>
	:global(.markdown-content) {
		color: var(--text-primary);
	}

	:global(.markdown-content h1) {
		color: var(--text-primary);
		margin-bottom: 1rem;
		margin-top: 2rem;
		font-size: 1.875rem;
		line-height: 2.25rem;
		font-weight: 700;
	}

	:global(.markdown-content h1:first-child) {
		margin-top: 0;
	}

	:global(.markdown-content h2) {
		color: var(--text-primary);
		margin-bottom: 0.75rem;
		margin-top: 1.5rem;
		font-size: 1.5rem;
		line-height: 2rem;
		font-weight: 600;
	}

	:global(.markdown-content h3) {
		color: var(--text-primary);
		margin-bottom: 0.5rem;
		margin-top: 1rem;
		font-size: 1.25rem;
		line-height: 1.75rem;
		font-weight: 600;
	}

	:global(.markdown-content p) {
		color: var(--text-primary);
		margin-bottom: 1rem;
		line-height: 1.625;
	}

	:global(.markdown-content ul),
	:global(.markdown-content ol) {
		color: var(--text-primary);
		margin-bottom: 1rem;
		margin-left: 1.5rem;
	}

	:global(.markdown-content ul > li + li),
	:global(.markdown-content ol > li + li) {
		margin-top: 0.5rem;
	}

	:global(.markdown-content li) {
		color: var(--text-primary);
	}

	:global(.markdown-content ul li) {
		list-style-type: disc;
	}

	:global(.markdown-content ol li) {
		list-style-type: decimal;
	}

	:global(.markdown-content a) {
		color: var(--primary);
		text-decoration: underline;
	}

	:global(.markdown-content a:hover) {
		color: var(--primary-dark);
	}

	:global(.markdown-content code) {
		background-color: var(--card-muted);
		color: var(--text-secondary);
		border: 1px solid var(--border);
		border-radius: 0.25rem;
		padding: 0.125rem 0.375rem;
		font-size: 0.875rem;
		line-height: 1.25rem;
	}

	:global(.markdown-content pre) {
		background-color: var(--card-muted);
		color: var(--text-primary);
		border: 1px solid var(--border);
		margin-bottom: 1rem;
		overflow-x: auto;
		border-radius: 0.25rem;
		padding: 1rem;
	}

	:global(.markdown-content pre code) {
		background-color: transparent;
		border: 0;
		padding: 0;
	}

	:global(.markdown-content blockquote) {
		color: var(--text-secondary);
		border-left: 4px solid var(--border);
		padding-left: 1rem;
		font-style: italic;
	}

	:global(.markdown-content img) {
		border: 2px solid var(--border);
		margin-top: 1rem;
		margin-bottom: 1rem;
		max-width: 100%;
	}
</style>
