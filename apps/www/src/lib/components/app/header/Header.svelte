<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import logo from '$lib/assets/programmerbar-modern.svg';
	import { cn } from '$lib/cn';
	import { getAuthContext } from '$lib/context/user.context';
	import HeaderItem from './HeaderItem.svelte';
	import HeaderSignOut from './HeaderSignOut.svelte';
	import MenuItem from './MenuItem.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import { Menu, X } from 'lucide-svelte';
	import MenuSignOut from './MenuSignOut.svelte';

	let isOpen = $state(false);
	let auth = getAuthContext();

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
	class={cn({
		'fixed left-0 top-0 z-50 h-screen w-full bg-background': isOpen
	})}
>
	<ProgressBar />

	<header class="mx-auto flex w-full max-w-screen-lg justify-between px-4 py-8">
		<a href="/">
			<img src={logo} class="h-20 w-20" alt="ProgrammerBar Logo" />
		</a>

		<ul class="hidden items-center gap-4 md:flex">
			<HeaderItem to="/" name="/hjem" />
			<HeaderItem to="/meny" name="/meny" />
			<HeaderItem to="https://forms.gle/BLdygdoRJgjMbQZj6" name="/booking" />
			<HeaderItem to="/om-oss" name="/om oss" />
			{#if auth.user}
				<HeaderSignOut />
			{/if}
		</ul>

		<button onclick={toggleMenu} class="block md:hidden">
			{#if isOpen}
				<X class="h-8 w-8" />
			{:else}
				<Menu class="h-8 w-8" />
			{/if}
		</button>
	</header>

	{#if isOpen}
		<ul class="flex flex-col items-center">
			<MenuItem to="/" name="/hjem" />
			<MenuItem to="/meny" name="/meny" />
			<MenuItem to="https://forms.gle/BLdygdoRJgjMbQZj6" name="/booking" />
			<MenuItem to="/om-oss" name="/om oss" />
			{#if auth.user}
				<MenuSignOut />
			{:else}
				<MenuItem to="/logg-inn" name="/logg inn" />
			{/if}
		</ul>
	{/if}
</div>
