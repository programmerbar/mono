<script lang="ts">
	import logo from '$lib/assets/programmerbar-modern.svg';
	import {
		Home,
		Calendar,
		Users,
		Settings,
		Bell,
		User,
		Beer,
		Menu,
		X,
		Shield,
		Database,
		UserCheck
	} from '@lucide/svelte';
	import { page } from '$app/state';
	import { getUser } from '$lib/context/user.context';
	import { resolve } from '$app/paths';
	import type { Notification as DbNotification } from '$lib/db/schemas';
	import { cn } from '$lib/cn';
	import { onNavigate } from '$app/navigation';
	import type { RouteId } from '$app/types';

	type NavRoute = {
		name: string;
		routeId: RouteId;
		icon: typeof Home;
		count?: number;
	};

	type Props = {
		notifications: Array<DbNotification>;
		pendingApplicationsCount: number;
	};

	let { notifications, pendingApplicationsCount }: Props = $props();
	let user = getUser();
	let isSidebarOpen = $state(false);
	let isMobile = $state(true); // Start as mobile to prevent flash

	const showFullLayout = $derived((isSidebarOpen && isMobile) || !isMobile);

	// Main portal navigation items
	const portalRoutes = [
		{
			name: 'Hjem',
			routeId: '/(portal)/portal',
			icon: Home
		},
		{
			name: 'Arrangementer',
			routeId: '/(portal)/portal/arrangementer',
			icon: Calendar
		},
		{
			name: 'Brukere',
			routeId: '/(portal)/portal/brukere',
			icon: Users
		},
		{
			name: 'Min Profil',
			routeId: '/(portal)/portal/profil',
			icon: User
		}
	] satisfies Array<NavRoute>;

	// Admin routes (only visible to board members)
	const adminRoutes = $derived(
		$user?.role === 'board'
			? ([
					{
						name: 'Status',
						routeId: '/(portal)/portal/status',
						icon: Settings
					},
					{
						name: 'Admin Panel',
						routeId: '/(portal)/portal/admin',
						icon: Shield
					},
					{
						name: 'Bonghistorikk',
						routeId: '/(portal)/portal/admin/historikk',
						icon: Beer
					},
					{
						name: 'Søknader',
						routeId: '/(portal)/portal/admin/soknader',
						icon: UserCheck,
						count: pendingApplicationsCount
					}
				] satisfies Array<NavRoute>)
			: []
	);

	// CMS routes (only visible to board members)
	const cmsRoutes: string | any[] | null | undefined = [];
	// TODO When I have time
	// const cmsRoutes = $derived(
	// 	$user?.role === 'board'
	// 		? ([
	// 				{
	// 					name: 'Produsenter',
	// 					routeId: '/(portal)/portal/admin/cms/producers',
	// 					icon: Database
	// 				},
	// 				{
	// 					name: 'Produkttyper',
	// 					routeId: '/(portal)/portal/admin/cms/product-types',
	// 					icon: Database
	// 				},
	// 				{
	// 					name: 'Produkter',
	// 					routeId: '/(portal)/portal/admin/cms/products',
	// 					icon: Database
	// 				}
	// 			] satisfies Array<NavRoute>)
	// 		: []
	// );

	const notificationsRoute = '/(portal)/portal/notifikasjoner';
	const notificationsHref = resolve(notificationsRoute);

	const handleResize = () => {
		if (typeof window === 'undefined') return;

		const wasDesktop = !isMobile;
		isMobile = window.innerWidth < 1024;

		// Only auto-open on desktop, keep closed on mobile
		if (!isMobile && wasDesktop !== !isMobile) {
			// Transitioning from mobile to desktop - open sidebar
			isSidebarOpen = true;
		} else if (isMobile) {
			// On mobile, keep sidebar closed by default
			isSidebarOpen = false;
		}
	};

	onNavigate(() => {
		if (isMobile) {
			isSidebarOpen = false;
		}
	});

	$effect(() => {
		// Initial setup
		if (typeof window !== 'undefined') {
			isMobile = window.innerWidth < 1024;
			isSidebarOpen = window.innerWidth >= 1024;
		}
	});

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}
</script>

<svelte:window onresize={handleResize} />

<!-- Mobile toggle button - floating action button -->
<div class="z-60 fixed bottom-6 right-6 lg:hidden">
	<button
		onclick={toggleSidebar}
		class="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl active:scale-95"
	>
		{#if isSidebarOpen}
			<X class="h-6 w-6" />
		{:else}
			<Menu class="h-6 w-6" />
		{/if}
	</button>
</div>

<!-- Overlay for mobile -->
{#if isSidebarOpen && isMobile}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="backdrop-blur-xs fixed inset-0 z-40 bg-black/20 lg:hidden"
		onclick={toggleSidebar}
	></div>
{/if}

<!-- Sidebar -->
<aside
	class={cn(
		'fixed left-0 top-0 z-50 h-[100svh] transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out',
		{
			'w-80': isSidebarOpen && isMobile, // Large width when opened on mobile
			'w-16 sm:w-20': !isSidebarOpen || !isMobile, // Narrow when closed or not mobile
			'lg:w-64': true, // Desktop width
			'translate-x-0': isSidebarOpen,
			'-translate-x-full lg:translate-x-0': !isSidebarOpen
		}
	)}
>
	<div class="flex h-full flex-col">
		<!-- Header -->
		<div
			class={cn('flex items-center border-b border-gray-200 py-4', {
				'justify-center px-2': !showFullLayout,
				'justify-start gap-3 px-6': showFullLayout
			})}
		>
			<img
				src={logo}
				alt="Programmerbar"
				class={cn('', {
					'h-6 w-6': !showFullLayout,
					'h-8 w-8': showFullLayout
				})}
			/>
			<div
				class={cn('', {
					hidden: !showFullLayout,
					block: showFullLayout
				})}
			>
				<h1 class="font-bold text-gray-800">Portal</h1>
				<p class="text-xs text-gray-500">Programmerbar</p>
			</div>
		</div>

		<!-- Navigation -->
		<nav
			class={cn('flex-1 space-y-6 overflow-y-auto py-6', {
				'px-1': !showFullLayout,
				'space-y-8 px-4': showFullLayout
			})}
		>
			<!-- Main Portal Section -->
			<div>
				<h2
					class={cn('mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500', {
						hidden: !showFullLayout,
						block: showFullLayout
					})}
				>
					Generelt
				</h2>
				<ul class="space-y-1">
					{#each portalRoutes as route (route.routeId)}
						{@const href = resolve(route.routeId)}
						{@const isActive = page.url.pathname === href}
						<li>
							<a
								{href}
								class={cn(
									'flex items-center rounded-lg py-2 text-sm font-medium transition-colors',
									{
										'justify-center gap-0 px-1': !showFullLayout,
										'justify-start gap-3 px-3': showFullLayout,
										'bg-blue-50 text-blue-700': isActive,
										'text-gray-600 hover:bg-gray-50 hover:text-gray-900': !isActive
									}
								)}
								title={route.name}
							>
								<route.icon class="h-5 w-5 flex-shrink-0" />
								<span
									class={cn('', {
										hidden: !showFullLayout,
										inline: showFullLayout
									})}>{route.name}</span
								>
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Admin Section (only for board members) -->
			{#if adminRoutes.length > 0}
				<div>
					<h2
						class={cn('mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500', {
							hidden: !showFullLayout,
							block: showFullLayout
						})}
					>
						Administrator
					</h2>
					<ul class="space-y-1">
						{#each adminRoutes as route (route.routeId)}
							{@const href = resolve(route.routeId)}
							{@const isActive = page.url.pathname === href}
							<li>
								<a
									{href}
									class={cn(
										'relative flex items-center rounded-lg py-2 text-sm font-medium transition-colors',
										{
											'justify-center gap-0 px-1': !showFullLayout,
											'justify-start gap-3 px-3': showFullLayout,
											'bg-amber-50 text-amber-700': isActive,
											'text-gray-600 hover:bg-gray-50 hover:text-gray-900': !isActive
										}
									)}
									title={route.name}
								>
									<route.icon class="h-5 w-5 flex-shrink-0" />
									<span
										class={cn('flex-1', {
											hidden: !showFullLayout,
											inline: showFullLayout
										})}>{route.name}</span
									>
									{#if route.count && route.count > 0}
										<span
											class={cn(
												'flex items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white',
												{
													'absolute -right-1 -top-1 h-4 w-4': !showFullLayout,
													'static h-5 w-5': showFullLayout
												}
											)}
										>
											{route.count}
										</span>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- CMS Section (only for board members) -->
			{#if cmsRoutes.length > 0}
				<div>
					<h2
						class={cn('mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500', {
							hidden: !showFullLayout,
							block: showFullLayout
						})}
					>
						CMS
					</h2>
					<ul class="space-y-1">
						{#each cmsRoutes as route (route.routeId)}
							{@const href = resolve(route.routeId)}
							{@const isActive = page.url.pathname === href}
							<li>
								<a
									{href}
									class={cn(
										'flex items-center rounded-lg py-2 text-sm font-medium transition-colors',
										{
											'justify-center gap-0 px-1': !showFullLayout,
											'justify-start gap-3 px-3': showFullLayout,
											'bg-blue-50 text-blue-700': isActive,
											'text-gray-600 hover:bg-gray-50 hover:text-gray-900': !isActive
										}
									)}
									title={route.name}
								>
									<route.icon class="h-5 w-5 flex-shrink-0" />
									<span
										class={cn('', {
											hidden: !showFullLayout,
											inline: showFullLayout
										})}>{route.name}</span
									>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- Notifications -->
			<div>
				<ul class="space-y-1">
					<li>
						<a
							href={notificationsHref}
							class={cn(
								'relative flex items-center rounded-lg py-2 text-sm font-medium transition-colors',
								{
									'justify-center gap-0 px-1': !showFullLayout,
									'justify-start gap-3 px-3': showFullLayout,
									'bg-gray-100 text-gray-900': page.url.pathname === notificationsHref,
									'text-gray-600 hover:bg-gray-50 hover:text-gray-900':
										page.url.pathname !== notificationsHref
								}
							)}
							title="Notifikasjoner"
						>
							<Bell class="h-5 w-5 flex-shrink-0" />
							<span
								class={cn('flex-1', {
									hidden: !showFullLayout,
									inline: showFullLayout
								})}>Notifikasjoner</span
							>
							{#if notifications.length > 0}
								<span
									class={cn(
										'flex items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white',
										{
											'absolute -right-1 -top-1 h-4 w-4': !showFullLayout,
											'static h-5 w-5': showFullLayout
										}
									)}
								>
									{notifications.length}
								</span>
							{/if}
						</a>
					</li>
				</ul>
			</div>
		</nav>

		<!-- User section -->
		<div
			class={cn('border-t border-gray-200', {
				'p-2': !showFullLayout,
				'p-4': showFullLayout
			})}
		>
			<div
				class={cn('mb-3 flex items-center', {
					'justify-center gap-0': !showFullLayout,
					'justify-start gap-3': showFullLayout
				})}
			>
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
					<span class="text-sm font-medium text-blue-600">
						{$user?.name?.charAt(0)?.toUpperCase() || 'U'}
					</span>
				</div>
				<div
					class={cn('min-w-0 flex-1', {
						hidden: !showFullLayout,
						block: showFullLayout
					})}
				>
					<p class="truncate text-sm font-medium text-gray-700">{$user?.name}</p>
					<p class="truncate text-xs text-gray-500">
						{$user?.role === 'board' ? 'Styret' : 'Frivillig'}
					</p>
				</div>
			</div>

			<a
				href={resolve('/')}
				class={cn(
					'flex w-full items-center rounded-lg py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900',
					{
						'justify-center gap-0 px-1': !showFullLayout,
						'justify-start gap-2 px-3': showFullLayout
					}
				)}
				title="Hjem"
			>
				<Home class="h-4 w-4 flex-shrink-0" />
				<span
					class={cn('', {
						hidden: !showFullLayout,
						inline: showFullLayout
					})}>Til forsiden</span
				>
			</a>
		</div>
	</div>
</aside>
