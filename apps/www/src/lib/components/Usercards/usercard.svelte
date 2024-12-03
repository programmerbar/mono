<script lang="ts">
	import { enhance } from '$app/forms';
	import { getAuthContext } from '$lib/context/user.context';
	import type { User } from '$lib/db/schema';
	import { initials, mailto } from '$lib/utils';
	import { Check, Ellipsis, X } from 'lucide-svelte';

	type Props = {
		user: User;
	};

	let { user }: Props = $props();
	let auth = getAuthContext();
	let isBoardMember = $derived(auth.user?.role === 'board');
	let isMenuOpen = $state(false);

	let form = $state<HTMLFormElement>();

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function submitForm() {
		form?.submit();
		isMenuOpen = false;
	}
</script>

<li class="relative block rounded-lg border bg-white p-4">
	{#if isBoardMember}
		<div class="absolute right-2 top-2">
			<button onclick={toggleMenu}>
				{#if isMenuOpen}
					<X class="size-6 text-gray-500" />
				{:else}
					<Ellipsis class="size-6 text-gray-500" />
				{/if}
			</button>
			{#if isMenuOpen}
				<div class="absolute right-0 z-10 mt-2 w-32 overflow-hidden rounded-md bg-white shadow-lg">
					<form bind:this={form} method="post" action="?/changeRole" use:enhance>
						<input type="hidden" name="id" value={user.id} />
						<ul>
							<li>
								<label
									class="flex w-full cursor-pointer items-center px-4 py-2 text-left text-sm hover:bg-gray-100"
								>
									<input
										type="radio"
										name="role"
										value="board"
										class="peer hidden"
										onclick={submitForm}
										bind:group={user.role}
									/>
									<Check class="mr-2 hidden size-6 text-green-500 peer-checked:block" />
									<span>Styret</span>
								</label>
							</li>
							<li>
								<label
									class="flex w-full cursor-pointer items-center px-4 py-2 text-left text-sm hover:bg-gray-100"
								>
									<input
										type="radio"
										name="role"
										value="normal"
										class="peer hidden"
										onclick={submitForm}
										bind:group={user.role}
									/>
									<Check class="mr-2 hidden size-6 text-green-500 peer-checked:block" />
									<span>Frivillig</span>
								</label>
							</li>
						</ul>
					</form>
				</div>
			{/if}
		</div>
	{/if}

	<button onclick={toggleMenu} class="mx-auto mb-2 flex justify-center">
		<div class="flex h-16 w-16 items-center justify-center rounded-full border bg-gray-200">
			<span class="text-lg font-medium text-gray-600">{initials(user.name)}</span>
		</div>
	</button>

	<div>
		<p class="text-center font-medium">{user.name}</p>
		<p class="mt-1 text-center text-sm">
			{#if user.role === 'board'}
				<span class="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
					>Styret</span
				>
			{:else}
				<span class="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800"
					>Frivillig</span
				>
			{/if}
		</p>
		<p class="mt-1 text-center text-sm">
			<a class="hover:underline" href={mailto(user.email)}>{user.email}</a>
		</p>
	</div>
</li>
