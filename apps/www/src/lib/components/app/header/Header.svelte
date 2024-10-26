<script lang="ts">
	import { enhance } from '$app/forms';
	import { onNavigate } from '$app/navigation';
	import logo from '$lib/assets/programmerbar-modern.svg';
	import { cn } from '$lib/cn';
	import { getAuthContext } from '$lib/context/user.context';
	import HeaderItem from './HeaderItem.svelte';
	import HeaderSignOut from './HeaderSignOut.svelte';
	import MenuItem from './MenuItem.svelte';
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
		'h-screen fixed top-0 left-0 bg-white w-full z-50': isOpen
	})}
>
	<header class="flex justify-between w-full py-8 mx-auto max-w-screen-lg px-4">
		<a href="/">
			<img src={logo} class="h-20 w-20" alt="ProgrammerBar Logo" />
		</a>

		<ul class="hidden md:flex items-center gap-4">
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
