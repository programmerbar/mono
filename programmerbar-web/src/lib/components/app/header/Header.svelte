<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import logo from '$lib/assets/programmerbar-modern.svg';
	import HeaderItem from './HeaderItem.svelte';
	import HeaderSignOut from './HeaderSignOut.svelte';
	import MenuItem from './MenuItem.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import { Menu, X, Moon, Sun } from '@lucide/svelte';
	import MenuSignOut from './MenuSignOut.svelte';
	import { getUser } from '$lib/states/user.svelte';
	import { resolve } from '$app/paths';
	import { getAppThemeContext } from '$lib/states/app-theme.svelte';

	let isOpen = $state(false);
	let user = getUser();
	let theme = getAppThemeContext();

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

<ProgressBar />

<header class="mx-auto flex w-full max-w-7xl justify-between px-4 py-8">
	<a href={resolve('/')}>
		<img src={logo} class="h-20 w-20" alt="ProgrammerBar Logo" />
	</a>

	<ul class="hidden items-center gap-4 md:flex">
		<HeaderItem to={resolve('/')} name="/hjem" />
		<HeaderItem to={resolve('/meny')} name="/meny" />
		<HeaderItem to="https://forms.gle/BLdygdoRJgjMbQZj6" name="/booking" />
		<HeaderItem to={resolve('/om-oss')} name="/om_oss" />
		{#if !!user.current}
			<HeaderSignOut />
		{:else}
			<HeaderItem to={resolve('/bli-frivillig')} name="/bli_frivillig" />
		{/if}
		<button
			onclick={() => theme.toggle()}
			class="text-foreground-secondary hover:text-primary flex items-center justify-center transition-colors"
			title={theme.isDark ? 'Bytt til lyst tema' : 'Bytt til mørkt tema'}
			aria-label={theme.isDark ? 'Bytt til lyst tema' : 'Bytt til mørkt tema'}
		>
			{#if theme.isDark}
				<Sun class="h-6 w-6" />
			{:else}
				<Moon class="h-6 w-6" />
			{/if}
		</button>
	</ul>

	<button
		onclick={toggleMenu}
		class="text-foreground-primary hover:text-primary block transition-colors md:hidden"
	>
		{#if isOpen}
			<X class="h-8 w-8" />
		{:else}
			<Menu class="h-8 w-8" />
		{/if}
	</button>
</header>

{#if isOpen}
	<!-- Overlay backdrop -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onclick={toggleMenu}></div>

	<!-- Mobile menu -->
	<div class="bg-background fixed top-0 left-0 z-50 h-screen w-full md:hidden">
		<div class="flex justify-end p-4">
			<button
				onclick={toggleMenu}
				class="text-foreground-primary hover:text-primary flex items-center justify-center transition-colors"
				aria-label="Lukk meny"
			>
				<X class="h-8 w-8" />
			</button>
		</div>
		<ul class="flex flex-col items-center pt-8">
			<MenuItem to={resolve('/')} name="/hjem" />
			<MenuItem to={resolve('/meny')} name="/meny" />
			<MenuItem to="https://forms.gle/BLdygdoRJgjMbQZj6" name="/booking" />
			<MenuItem to={resolve('/om-oss')} name="/om_oss" />
			{#if !!user.current}
				<MenuSignOut />
			{:else}
				<MenuItem to={resolve('/bli-frivillig')} name="/bli_frivillig" />
			{/if}
			<li class="mt-8">
				<button
					onclick={() => theme.toggle()}
					class="text-foreground-secondary hover:text-primary flex items-center justify-center gap-2 px-6 py-4 transition-colors"
					title={theme.isDark ? 'Bytt til lyst tema' : 'Bytt til mørkt tema'}
					aria-label={theme.isDark ? 'Bytt til lyst tema' : 'Bytt til mørkt tema'}
				>
					{#if theme.isDark}
						<Sun class="h-6 w-6" />
					{:else}
						<Moon class="h-6 w-6" />
					{/if}
					<span>{theme.isDark ? 'Lyst tema' : 'Mørkt tema'}</span>
				</button>
			</li>
		</ul>
	</div>
{/if}
