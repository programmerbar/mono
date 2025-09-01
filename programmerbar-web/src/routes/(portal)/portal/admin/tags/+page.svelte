<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Plus, Trash2, X, Edit } from '@lucide/svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import TagList from '$lib/components/ui/TagList.svelte';

	let { data, form } = $props();

	let showCreateForm = $state(false);
	let editingTag: string | null = $state(null);
	let selectedUserId = $state('');
	let selectedTagId = $state('');
	let userSearch = $state('');

	async function handleFormSubmit() {
		await invalidateAll();
		showCreateForm = false;
		editingTag = null;
		selectedUserId = '';
		selectedTagId = '';
	}

	function handleRemoveTag(userId: string, tagId: string) {
		const form = new FormData();
		form.append('tagId', tagId);
		form.append('userId', userId);

		fetch('?/removeTag', {
			method: 'POST',
			body: form
		}).then(() => {
			invalidateAll();
		});
	}

	function getUserTags(userId: string) {
		return data.userTags[userId] || [];
	}

	const filteredUsers = $derived(
		data.allUsers.filter(
			(user) =>
				user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
				user.email.toLowerCase().includes(userSearch.toLowerCase())
		)
	);

	function getPermissionLabel(permission: string): string {
		switch (permission) {
			case 'canSeeOpplearing':
				return 'Kan se opplæring';
			case 'canSeeBeerClaims':
				return 'Kan se drikke cash-in';
			case 'canSeeReferrals':
				return 'Kan se henvisninger';
			case 'canSeeBongs':
				return 'Kan se bongs';
			case 'canSeeUserChanges':
				return 'Kan se brukerendringer';
			case 'canSeeEventDepartures':
				return 'Kan se arrangement-avgang';
			case 'canSeeEventUpdates':
				return 'Kan se arrangement-oppdateringer';
			case 'canSeeShiftUpdates':
				return 'Kan se vakt-oppdateringer';
			case 'canManageTagOptions':
				return 'Kan administrere tag-alternativer';
			case 'canSeeTagChanges':
				return 'Kan se tag-endringer';
			case 'canSeeContactSubmissions':
				return 'Kan se kontakt-skjema';
			case 'canSeeNewcomers':
				return 'Kan se nykommere';
			default:
				return permission;
		}
	}
</script>

<div class="flex flex-col gap-4 p-4 sm:gap-6 sm:p-0">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<h1 class="text-2xl font-bold">Tag-administrasjon</h1>
		<button
			onclick={() => (showCreateForm = !showCreateForm)}
			class="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 sm:justify-start"
		>
			<Plus class="size-4" />
			Opprett tag
		</button>
	</div>

	{#if form?.message}
		<div
			class="rounded-lg p-4 {'success' in form && form.success
				? 'bg-green-50 text-green-700'
				: 'bg-red-50 text-red-700'}"
		>
			{form.message}
		</div>
	{/if}

	{#if showCreateForm}
		<div class="rounded-lg border bg-white p-4 sm:p-6">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold">Opprett ny tag</h2>
				<button onclick={() => (showCreateForm = false)}>
					<X class="size-5" />
				</button>
			</div>

			<form
				action="?/createTag"
				method="post"
				use:enhance={handleFormSubmit}
				class="flex flex-col gap-4"
			>
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700">Navn</label>
					<input
						type="text"
						id="name"
						name="name"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
					/>
				</div>

				<div>
					<label for="description" class="block text-sm font-medium text-gray-700"
						>Beskrivelse</label
					>
					<textarea
						id="description"
						name="description"
						rows="3"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
					></textarea>
				</div>

				<div>
					<label for="color" class="block text-sm font-medium text-gray-700">Farge</label>
					<input
						type="color"
						id="color"
						name="color"
						class="mt-1 block h-10 w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
					/>
				</div>

				{#if data.canManageOptions}
					<div class="border-t pt-4">
						<h4 class="mb-3 font-medium text-gray-900">Tag-tillatelser</h4>
						<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
							{#each Object.keys(data.tags[0] || {}).filter( (key) => key.startsWith('can') ) as permission (permission)}
								<div class="flex items-center">
									<input
										type="checkbox"
										id={permission}
										name={permission}
										class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
									/>
									<label for={permission} class="ml-2 block text-sm text-gray-900">
										{getPermissionLabel(permission)}
									</label>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<div class="flex justify-end gap-2">
					<button
						type="button"
						onclick={() => (showCreateForm = false)}
						class="px-4 py-2 text-gray-600 hover:text-gray-800"
					>
						Avbryt
					</button>
					<button
						type="submit"
						class="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
					>
						Opprett tag
					</button>
				</div>
			</form>
		</div>
	{/if}

	<div class="grid gap-4">
		<h2 class="text-xl font-semibold">Eksisterende tags</h2>

		{#if data.tags.length === 0}
			<p class="text-gray-500">
				Ingen tags funnet. Klikk "Initialiser standard tags" for å opprette standard tags.
			</p>
		{/if}

		{#each data.tags as tag (tag.id)}
			<div class="rounded-lg border bg-white p-4 sm:p-6">
				<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
					<div class="flex items-center gap-3">
						{#if tag.color}
							<div class="h-4 w-4 rounded-full" style="background-color: {tag.color}"></div>
						{/if}
						<div>
							<h3 class="font-semibold">{tag.name}</h3>
							{#if tag.description}
								<p class="text-sm text-gray-600">{tag.description}</p>
							{/if}
						</div>
					</div>

					<div class="flex items-center gap-2 self-end sm:self-auto">
						<button
							onclick={() => (editingTag = editingTag === tag.id ? null : tag.id)}
							class="p-2 text-gray-500 hover:text-gray-700"
						>
							<Edit class="size-4" />
						</button>
						<form action="?/deleteTag" method="post" use:enhance={handleFormSubmit} class="inline">
							<input type="hidden" name="tagId" value={tag.id} />
							<button
								type="submit"
								onclick={(e) =>
									!confirm('Er du sikker på at du vil slette denne tag?') && e.preventDefault()}
								class="p-2 text-red-500 hover:text-red-700"
							>
								<Trash2 class="size-4" />
							</button>
						</form>
					</div>
				</div>

				{#if editingTag === tag.id}
					<div class="mt-4 border-t pt-4">
						<form
							action="?/updateTag"
							method="post"
							use:enhance={handleFormSubmit}
							class="flex flex-col gap-4"
						>
							<input type="hidden" name="tagId" value={tag.id} />

							<div>
								<label for="name-{tag.id}" class="block text-sm font-medium text-gray-700"
									>Navn</label
								>
								<input
									type="text"
									id="name-{tag.id}"
									name="name"
									value={tag.name}
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							</div>

							<div>
								<label for="description-{tag.id}" class="block text-sm font-medium text-gray-700"
									>Beskrivelse</label
								>
								<textarea
									id="description-{tag.id}"
									name="description"
									rows="2"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
									>{tag.description || ''}</textarea
								>
							</div>

							<div>
								<label for="color-{tag.id}" class="block text-sm font-medium text-gray-700"
									>Farge</label
								>
								<input
									type="color"
									id="color-{tag.id}"
									name="color"
									value={tag.color || '#3B82F6'}
									class="mt-1 block h-10 w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							</div>

							{#if data.canManageOptions}
								<div class="border-t pt-4">
									<h4 class="mb-3 font-medium text-gray-900">Tag-tillatelser</h4>
									<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
										{#each Object.keys(tag).filter( (key) => key.startsWith('can') ) as permission (permission)}
											<div class="flex items-center">
												<input
													type="checkbox"
													id="{permission}-{tag.id}"
													name={permission}
													checked={Boolean(tag[permission as keyof typeof tag])}
													class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
												/>
												<label for="{permission}-{tag.id}" class="ml-2 block text-sm text-gray-900">
													{getPermissionLabel(permission)}
												</label>
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<div class="flex justify-end gap-2">
								<button
									type="button"
									onclick={() => (editingTag = null)}
									class="px-4 py-2 text-gray-600 hover:text-gray-800"
								>
									Avbryt
								</button>
								<button
									type="submit"
									class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
								>
									Oppdater tag
								</button>
							</div>
						</form>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<div class="rounded-lg border bg-white p-4 sm:p-6">
		<h2 class="mb-4 text-xl font-semibold">Tildel tags til brukere</h2>

		<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start">
			<div class="relative w-full flex-1 min-w-0">
				<label for="userSearch" class="block text-sm font-medium text-gray-700">Søk bruker</label>
				<Input
					id="userSearch"
					bind:value={userSearch}
					placeholder="Søk på navn eller e-post..."
					class="mt-1 w-full"
				/>
				{#if userSearch && filteredUsers.length > 0}
					<div class="absolute z-10 mt-2 max-h-40 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
						{#each filteredUsers.slice(0, 5) as user (user.id)}
							<button
								type="button"
								onclick={() => {
									selectedUserId = user.id;
									userSearch = `${user.name} (${user.email})`;
								}}
								class="block w-full px-3 py-2 text-left hover:bg-gray-100"
							>
								{user.name} ({user.email})
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<div class="w-full flex-1 min-w-0">
				<label for="tagSelect" class="block text-sm font-medium text-gray-700">Velg tag</label>
				<select
					id="tagSelect"
					bind:value={selectedTagId}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
				>
					<option value="">-- Velg en tag --</option>
					{#each data.tags as tag (tag.id)}
						<option value={tag.id}>{tag.name}</option>
					{/each}
				</select>
			</div>
		</div>

		<form action="?/assignTag" method="post" use:enhance={handleFormSubmit} class="flex gap-2">
			<input type="hidden" name="userId" value={selectedUserId} />
			<input type="hidden" name="tagId" value={selectedTagId} />
			<Button type="submit" disabled={!selectedUserId || !selectedTagId} intent="primary">
				Tildel tag
			</Button>
		</form>
	</div>

	<div class="rounded-lg border bg-white p-4 sm:p-6">
		<h2 class="mb-4 text-xl font-semibold">Bruker tag-tildelinger</h2>

		<div class="space-y-4">
			{#each data.users as user (user.id)}
				<div class="border-b pb-4">
					<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
						<div>
							<h3 class="font-medium">{user.name}</h3>
							<p class="text-sm text-gray-600">{user.email}</p>
						</div>
						<div class="flex-shrink-0">
							<TagList
								tags={getUserTags(user.id)}
								size="sm"
								removable={true}
								onRemove={(tagId) => handleRemoveTag(user.id, tagId)}
							/>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
