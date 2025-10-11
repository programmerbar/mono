<script lang="ts">
	import logo from '$lib/assets/programmerbar-modern.svg';
	import { Bell, Menu, X } from '@lucide/svelte';
	import { getUser } from '$lib/context/user.context';
	import { resolve } from '$app/paths';
	import { onNavigate } from '$app/navigation';
	import type { Notification as DbNotification } from '$lib/db/schemas';
	import type { RouteId } from '$app/types';

	type Props = {
		notifications: Array<DbNotification>;
	};

	let { notifications }: Props = $props();

	let user = getUser();
	let isOpen = $state(false);

	type RouteLink = {
		name: string;
		routeId: RouteId;
		visible?: boolean;
	};

	const routes = $derived([
		{
			name: 'Hjem',
			routeId: '/(portal)/portal'
		},
		{
			name: 'Status',
			routeId: '/(portal)/portal/status'
		},
		{
			name: 'Arrangement',
			routeId: '/(portal)/portal/arrangementer'
		},
		{
			name: 'Brukere',
			routeId: '/(portal)/portal/brukere'
		},
		{
			name: 'Min Profil',
			routeId: '/(portal)/portal/profil'
		},
		{
			name: 'Admin',
			routeId: '/(portal)/portal/admin',
			visible: $user?.role === 'board'
		}
	] satisfies Array<RouteLink>);

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
<div class="bg-background sticky top-0 z-10 px-4">
	<header class="flex items-center justify-between">
		<a href={resolve('/')} class="mr-10">
			<img src={logo} alt="Logo" class="h-12 w-12" />
		</a>
		<nav class="flex items-center">
			<ul class="hidden items-center gap-2 md:flex">
				{#each routes as route (route.routeId)}
					{#if route.visible !== false}
						<li>
							<a
								class="px-1 text-gray-500 transition hover:text-gray-900"
								href={resolve(route.routeId)}
							>
								{route.name}
							</a>
						</li>
					{/if}
				{/each}
				<li>
					<a
						class="relative px-1 text-gray-500 transition hover:text-gray-900"
						href={resolve('/(portal)/portal/notifikasjoner')}
					>
						<Bell class="size-5" />
						{#if notifications.length > 0}
							<span
								class="absolute top-2 left-4 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white"
							>
								{notifications.length}
							</span>
						{/if}
					</a>
				</li>
			</ul>
			<a
				class="relative mr-4 block px-1 text-gray-500 transition hover:text-gray-900 md:hidden"
				href={resolve('/(portal)/portal/notifikasjoner')}
			>
				<Bell class="size-5" />
				{#if notifications.length > 0}
					<span
						class="absolute top-2 left-4 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white"
					>
						{notifications.length}
					</span>
				{/if}
			</a>
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
			{#each routes as route (route.routeId)}
				{#if route.visible !== false}
					<li>
						<a
							class="px-1 text-gray-500 transition hover:text-gray-900"
							href={resolve(route.routeId)}
						>
							{route.name}
						</a>
					</li>
				{/if}
			{/each}
		</ul>
	{/if}
</div>
