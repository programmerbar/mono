<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { getProfilePicture } from '$lib/data/api';
	import type { ChangeEventHandler } from 'svelte/elements';
	import { Upload } from 'lucide-svelte';

	let { data } = $props();

	let pictureInput = $state<HTMLInputElement | null>(null);
	let picture = $state<string | null>(null);
	let loading = $state(false);

	$effect(() => {
		const fetchProfilePicture = async () => {
			loading = true;
			picture = await getProfilePicture(data.user.id);
			loading = false;
		};

		fetchProfilePicture();
	});

	const handlePictureChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const file = event.currentTarget.files?.[0];
		if (file) {
			picture = URL.createObjectURL(file);
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
				<button type="button" onclick={() => pictureInput?.click()}>
					<div
						class="group w-24 h-24 border-2 border-gray-400 bg-gray-200 rounded-full relative overflow-hidden flex flex-col items-center justify-center"
					>
						{#if picture}
							<img src={picture} alt="Profilbilde" class="w-full h-full absolute" />
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

			<button
				type="submit"
				class="mt-4 h-10 px-4 rounded-lg border hover:bg-gray-200 hover:border-gray-300 transition-colors text-gray-700 font-medium"
			>
				Lagre
			</button>
		</form>
	</div>
</main>
