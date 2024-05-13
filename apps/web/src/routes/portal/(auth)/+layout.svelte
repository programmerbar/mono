<script lang="ts">
	import {
		Home,
		Users,
		User,
		DoorOpen,
		Martini,
		Mail,
		Calendar,
		Menu,
		X,
		Settings
	} from 'lucide-svelte';
	import SidebarItem from '$lib/components/SidebarItem.svelte';
	import { browser } from '$app/environment';
	import { cn } from '$lib/cn';
	import { onNavigate } from '$app/navigation';

	let { data, children } = $props();

	let isOpen = $state(false);
	let windowWidth = $state(browser ? window.innerWidth : 0);

	$effect(() => {
		if (windowWidth >= 768) {
			isOpen = false;
		}
	});

	onNavigate(() => {
		isOpen = false;
	});
</script>

<svelte:window on:resize={() => (windowWidth = window.innerWidth)} />

<div class="flex flex-col min-h-screen h-full">
	<div class="flex md:hidden">
		<div class="flex items-center justify-between w-full p-4 border-b">
			<h1 class="text-xl font-medium">Frivillig Portal</h1>
			<button class="p-2">
				{#if isOpen}
					<X class="h-6 w-6" onclick={() => (isOpen = false)} />
				{:else}
					<Menu class="h-6 w-6" onclick={() => (isOpen = true)} />
				{/if}
			</button>
		</div>
	</div>

	<div
		class={cn('flex h-full', {
			relative: isOpen
		})}
	>
		<div
			class={cn('hidden z-50 md:flex w-72 border-r h-full flex-col p-8', {
				'flex w-full h-full absolute bg-background': isOpen
			})}
		>
			<h1 class="hidden md:block text-xl font-medium mb-6">Frivillig Portal</h1>

			<menu class="flex flex-col gap-1">
				<li>
					<SidebarItem href="/portal/hjem"><Home class="h-5 w-5" /> Hjem</SidebarItem>
				</li>
				<li>
					<SidebarItem href="/portal/staplan"><Calendar class="h-5 w-5" /> Ståplan</SidebarItem>
				</li>
				<li>
					<SidebarItem href="/portal/frivillige"><Users class="h-5 w-5" /> Frivillige</SidebarItem>
				</li>
				{#if data.user.type === 'admin'}
					<li>
						<SidebarItem href="/portal/invitasjoner"
							><Mail class="h-5 w-5" /> Invitasjoner</SidebarItem
						>
					</li>
				{/if}
				{#if data.user.type === 'admin'}
					<li>
						<SidebarItem href="/portal/instillinger"
							><Settings class="h-5 w-5" /> Innstillinger</SidebarItem
						>
					</li>
				{/if}
				<li>
					<SidebarItem href="/portal/min-side"><User class="h-5 w-5" /> Min side</SidebarItem>
				</li>
				<hr />
				<li>
					<SidebarItem href="/"><Martini class="h-5 w-5" /> Forsiden</SidebarItem>
				</li>
			</menu>

			<div class="mt-auto space-y-2">
				<SidebarItem href="/logout" class="border"><DoorOpen class="h-5 w-5" /> Logg ut</SidebarItem
				>
				<p class="text-xs">Logget inn som, <span class="font-medium">{data.user.name}</span></p>
			</div>
		</div>

		<div class="p-8 flex-1 max-h-screen overflow-y-scroll">
			{@render children()}
		</div>
	</div>
</div>
