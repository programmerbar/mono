<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import Button from '$lib/components/ui/Button.svelte';
	import Heading from '$lib/components/ui/Heading.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
</script>

<div class="bg-background rounded-xl border-2 p-6 shadow-md">
	<Heading level={2} class="mb-6 text-center font-mono text-3xl font-medium md:text-4xl"
		>Kontakt oss</Heading
	>

	<form
		method="post"
		action="/kontakt-oss"
		class="space-y-4"
		use:enhance={() => {
			return ({ result }) => {
				if (result.type === 'success') {
					toast.success('Takk for din henvendelse!');
				} else {
					toast.error(
						'Noe gikk galt, prøv igjen senere. Hvis problemet vedvarer, kontakt oss på e-post, hei@programmerbar.no.'
					);
				}
			};
		}}
	>
		<div class="field">
			<label for="name" class="label">Name</label>
			<Input type="text" name="name" placeholder="Kari Nordmann" class="shadow-lg" />
		</div>

		<div class="field">
			<label for="email" class="label">Email</label>
			<Input type="email" name="email" placeholder="kari.nordmann@noreg.no" class="shadow-lg" />
		</div>

		<div class="flex flex-col gap-2">
			<label for="name" class="text-sm font-medium text-gray-700">Navn</label>
			<Input type="text" id="name" name="namekjkj" placeholder="Kari Nordmann" required />
		</div>

		<div class="flex flex-col gap-2">
			<label for="email" class="text-sm font-medium text-gray-700">E-post</label>
			<Input type="email" id="email" name="emailkjkj" placeholder="kari@norge.no" required />
		</div>

		<div class="flex flex-col gap-2">
			<label for="message" class="text-sm font-medium text-gray-700">Melding</label>
			<Textarea
				id="message"
				name="messagekjkj"
				rows={5}
				placeholder="Din melding her..."
				required
			/>
		</div>

		<Button type="submit" class="w-full">Send inn</Button>
	</form>
</div>

<style>
	.field {
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		height: 0;
		width: 0;
		z-index: -1;
	}
</style>
