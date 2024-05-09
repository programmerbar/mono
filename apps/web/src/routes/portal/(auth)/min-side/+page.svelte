<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { getProfilePicture } from '$lib/data/api';
	import type { ChangeEventHandler } from 'svelte/elements';
	import { Upload } from 'lucide-svelte';
	import Button from '$lib/components/ui/portal/Button.svelte';

	let { data } = $props();

	let pictureInput = $state<HTMLInputElement | null>(null);
	let pictureURL = $state<string | null>(`/profile-pic/${data.user.id}`);

	const handlePictureChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const file = event.currentTarget.files?.[0];
		if (file) {
			pictureURL = URL.createObjectURL(file);
		}
	};
</script>

<SEO title="Min side" />

<main class="max-w-screen-md">
	<h1 class="text-2xl font-medium mb-8">Min side</h1>

	<div>
		<h2 class="text-xl font-medium mb-4">Dine opplysninger</h2>

		<form
			method="post"
			class="space-y-4"
			enctype="multipart/form-data"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						toast.success('Opplysningene ble lagret!');
						invalidateAll();
					} else {
						toast.error('Noe gikk galt. Prøv igjen senere.');
					}
					await applyAction(result);
				};
			}}
		>
			<div>
				<input
					bind:this={pictureInput}
					type="file"
					id="avatar"
					name="avatar"
					class="hidden"
					accept="image/*"
					onchange={handlePictureChange}
				/>
				<button
					type="button"
					onclick={() => {
						pictureURL = null;
						pictureInput?.click();
					}}
				>
					<div
						class="group w-24 h-24 border-2 border-gray-400 bg-gray-200 rounded-full relative overflow-hidden flex flex-col items-center justify-center"
					>
						{#if pictureURL}
							<img src={pictureURL} alt="Profilbilde" class="w-full h-full absolute" />
							<div
								class="hidden group-hover:flex transition-all absolute inset-0 bg-black bg-opacity-30 items-center justify-center"
							>
								<p class="text-gray-200 text-sm">Endre</p>
							</div>
						{:else}
							<Upload class="w-8 h-8 text-gray-500" />
							<p class="text-sm text-gray-500">Last opp</p>
						{/if}
					</div>
				</button>
				<p class="text-xs text-gray-400 mt-2">Bildet ser best ut om det er firkantet.</p>
			</div>

			<div>
				<label for="name" class="text-sm font-medium">Navn</label>
				<input
					type="text"
					id="name"
					name="name"
					class="w-full border rounded-lg form-input bg-background h-10 border-gray-200"
					value={data.user.name}
				/>
			</div>

			<div>
				<label for="email" class="text-sm font-medium">E-post</label>
				<input
					type="email"
					id="email"
					name="email"
					class="w-full border rounded-lg form-input bg-background h-10 border-gray-200"
					value={data.user.email}
				/>
			</div>

			<Button type="submit" class="mt-4">Lagre</Button>
		</form>
	</div>
</main>
