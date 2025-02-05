<script lang="ts">
	import logo from '$lib/assets/programmerbar-modern.svg';
	import { Menu, X } from 'lucide-svelte';
	import { getUser } from '$lib/context/user.context';
	import { cn } from '$lib/cn';
	import { onNavigate } from '$app/navigation';

	let user = getUser();
	let isOpen = $state(false);

	const routes = $derived([
		{
			name: 'Hjem',
			href: '/portal'
		},
		{
			name: 'Status',
			href: '/portal/status'
		},
		{
			name: 'Cash Out',
			href: '/portal/claim-beer'
		},
		{
			name: 'Arrangement',
			href: '/portal/arrangementer'
		},
		{
			name: 'Brukere',
			href: '/portal/brukere'
		},
		{
			name: 'Admin',
			href: '/portal/admin',
			visible: $user?.role === 'board'
		}
	]);

	onNavigate(() => {
		isOpen = false;
		document.body.style.overflow = 'auto';
	});

	const toggleMenu = () => {
		isOpen = !isOpen;

		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	};

	const handleResize = () => {
		if (window.innerWidth > 768) {
			isOpen = false;
			document.body.style.overflow = 'auto';
		}
	};
</script>

<svelte:window onresize={handleResize} />

<div
	class={cn('bg-background sticky top-0 z-10 border-b p-4', {
		'h-screen overflow-y-auto': isOpen
	})}
>
	<header class="mx-auto flex max-w-screen-md items-center justify-between">
		<a href="/" class="mr-10">
			<img src={logo} alt="Logo" class="h-12 w-12" />
		</a>

		<nav>
			<ul class="mt-4 hidden gap-2 md:flex">
				{#each routes as route}
					{#if route.visible !== false}
						<li>
							<a class="px-1 text-gray-500 transition hover:text-gray-900" href={route.href}
								>{route.name}</a
							>
						</li>
					{/if}
				{/each}
			</ul>

			<button onclick={toggleMenu} class="block md:hidden">
				{#if isOpen}
					<X class="h-6 w-6" />
				{:else}
					<Menu class="h-6 w-6" />
				{/if}
			</button>
		</nav>
	</header>

	{#if isOpen}
		<ul class="mt-4 flex flex-col gap-2">
			{#each routes as route}
				{#if route.visible !== false}
					<li>
						<a class="px-1 text-gray-500 transition hover:text-gray-900" href={route.href}
							>{route.name}</a
						>
					</li>
				{/if}
			{/each}
		</ul>
	{/if}
</div>
