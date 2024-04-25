<script lang="ts">
	import { Home, Users, User, DoorOpen, Martini, Mail } from 'lucide-svelte';
	import SidebarItem from '$lib/components/SidebarItem.svelte';

	let { data, children } = $props();
</script>

<div class="flex min-h-screen h-full">
	<div class="w-72 border-r h-full flex flex-col p-8">
		<h1 class="text-xl font-medium mb-6">Navigasjon</h1>

		<menu class="flex flex-col gap-1">
			<li>
				<SidebarItem href="/portal/hjem"><Home class="h-5 w-5" /> Hjem</SidebarItem>
			</li>
			<li>
				<SidebarItem href="/portal/staplan"><Users class="h-5 w-5" /> Ståplan</SidebarItem>
			</li>
			{#if data.user.type === 'admin'}
				<li>
					<SidebarItem href="/portal/brukere"><Users class="h-5 w-5" /> Brukere</SidebarItem>
				</li>
			{/if}
			{#if data.user.type === 'admin'}
				<li>
					<SidebarItem href="/portal/invitasjoner"
						><Mail class="h-5 w-5" /> Invitasjoner</SidebarItem
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
			<p class="text-xs">Logget inn som, <span class="font-medium">{data.user.name}</span></p>

			<SidebarItem href="/logout" class="border"><DoorOpen class="h-5 w-5" /> Logg ut</SidebarItem>
		</div>
	</div>

	<div class="p-8 flex-1">
		{@render children()}
	</div>
</div>
