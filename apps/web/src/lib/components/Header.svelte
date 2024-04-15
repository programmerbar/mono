<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { cn } from '$lib/cn';

	const links = [
		{
			name: '/hjem',
			href: '/'
		},
		{
			name: '/meny',
			href: '/meny'
		},
		{
			name: '/booking',
			href: 'https://forms.gle/BLdygdoRJgjMbQZj6'
		},
		{
			name: '/om-oss',
			href: '/om-oss'
		}
	];

	let isOpen = $state(false);

	onNavigate(() => {
		isOpen = false;
	});

	$effect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : 'auto';

		return () => (document.body.style.overflow = 'auto');
	});
</script>

<div
	class={cn('', {
		'min-h-full fixed bg-background overflow-y-auto w-full h-full z-30 flex flex-col': isOpen
	})}
>
	<header class="flex items-center w-full justify-between px-4 py-8 mx-auto max-w-7xl">
		<div>
			<a href="/">
				<img class="h-24 w-24" src="/progbar-logo-ish.png" alt="Programmerbar logo" />
			</a>
		</div>

		<div>
			<div class="block md:hidden">
				<button
					onclick={() => (isOpen = !isOpen)}
					class="text-xl font-mono font-medium text-gray-600 hover:underline"
				>
					{#if isOpen}
						Lukk
					{:else}
						Åpne
					{/if}
				</button>
			</div>
			<nav class="hidden md:block">
				<ul class="flex items-center gap-4">
					{#each links as { href, name }}
						{@const isExternal = href.startsWith('http')}
						<li>
							<a
								class="text-xl font-medium text-gray-600 font-mono stroke-gray-600 stroke-2 flex items-center gap-1 hover:text-gray-800 hover:stroke-gray-900 hover:underline"
								{href}
								target={isExternal ? '_blank' : undefined}
								rel={isExternal ? 'noopener noreferrer' : undefined}
							>
								<span>
									{name}
								</span>
								{#if isExternal}
									<svg
										width="18px"
										height="18px"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<g>
											<path
												id="Vector"
												d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
											/>
										</g>
									</svg>
								{/if}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	</header>

	{#if isOpen}
		<div class="flex flex-col md:hidden">
			{#each links as { href, name }}
				{@const isExternal = href.startsWith('http')}
				<a
					class="block text-2xl font-mono hover:text-gray-900 hover:bg-primary p-4"
					{href}
					target={isExternal ? '_blank' : undefined}
					rel={isExternal ? 'noopener noreferrer' : undefined}
				>
					{name}
				</a>
			{/each}
		</div>
	{/if}
</div>
