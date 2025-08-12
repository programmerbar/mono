<script lang="ts">
	import FormInput from '$lib/components/ui/form/FormInput.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { enhance } from '$app/forms';
	import { Save } from '@lucide/svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Min Profil</title>
</svelte:head>
<div class="mx-auto max-w-4xl space-y-8 px-4">
	<div class="overflow-hidden rounded-2xl border-2 bg-background shadow-lg">
		<div class="border-b bg-gray-200 px-8 py-6">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-xl font-semibold text-gray-800">Profilinnstillinger</h2>
					<p class="text-sm text-gray-600">Oppdater din informasjon og innstillinger</p>
				</div>
			</div>
		</div>
		<div class="p-8">
			{#if form?.message}
				<div
					class="mb-4 rounded-md p-4 {form.success
						? 'bg-green-50 text-green-700'
						: 'bg-red-50 text-red-700'}"
				>
					<p>{form.message}</p>
				</div>
			{/if}
			<form id="profile-form" method="POST" action="?/save" use:enhance>
				<div class="group">
					<div class="rounded-xl border-2 bg-background p-6 shadow-lg">
						<div class="mb-6">
							<h3 class="flex items-center gap-2 text-lg font-medium text-gray-800">
								Kontaktinformasjon
							</h3>
							<p class="text-sm text-gray-600">Oppdater din kontaktinformasjon</p>
						</div>
						<div class="space-y-4">
							<FormInput
								type="email"
								id="altEmail"
								name="altEmail"
								label="Alternativ e-post"
								bind:value={data.user.altEmail}
								placeholder="din.epost@example.com"
							/>
						</div>
						<div class="space-y-4">
							<FormInput
								type="phone"
								id="phone"
								name="phone"
								label="Telefon nr"
								bind:value={data.user.phone}
								placeholder="+47 12 345 678"
							/>
						</div>
					</div>
				</div>
				<div class="flex justify-end pt-6">
					<Button type="submit" intent="primary" class="flex items-center gap-2">
						<Save size={16} />
						Lagre endringer
					</Button>
				</div>
			</form>
		</div>
	</div>
</div>
