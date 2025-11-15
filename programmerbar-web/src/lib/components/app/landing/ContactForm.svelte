<script lang="ts">
	import { toast } from 'svelte-sonner';
	import Button from '$lib/components/ui/Button.svelte';
	import Heading from '$lib/components/ui/Heading.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import { createContactSubmissionAction } from '../../../../routes/(app)/common.remote';
</script>

<div class="bg-background flex h-full flex-col rounded-xl border-2 p-6 shadow-md">
	<Heading level={2} class="mb-6 text-center font-mono text-3xl font-medium md:text-4xl"
		>Kontakt oss</Heading
	>

	<form
		class="flex flex-1 flex-col space-y-4"
		{...createContactSubmissionAction.enhance(async ({ form, submit }) => {
			try {
				await submit();
				form.reset();

				toast.success('Takk for din henvendelse!');
			} catch {
				toast.error(
					'Noe gikk galt, prøv igjen senere. Hvis problemet vedvarer, kontakt oss på e-post, hei@programmerbar.no.'
				);
			}
		})}
	>
		<label class="field">
			Name
			<input
				{...createContactSubmissionAction.fields.name.as('text')}
				placeholder="Kari Nordmann"
			/>
		</label>

		<label class="field">
			Email
			<input
				{...createContactSubmissionAction.fields.email.as('email')}
				placeholder="kari.nordmann@noreg.no"
			/>
		</label>

		<label class="flex flex-col gap-2">
			<span class="text-sm font-medium text-gray-700">Navn</span>
			<Input
				{...createContactSubmissionAction.fields.namekjkj.as('text')}
				placeholder="Kari Nordmann"
				required
			/>
		</label>

		<label class="flex flex-col gap-2">
			<span class="text-sm font-medium text-gray-700">E-post</span>
			<Input
				{...createContactSubmissionAction.fields.emailkjkj.as('email')}
				placeholder="kari@norge.no"
				required
			/>
		</label>

		<label class="flex flex-col gap-2">
			<span class="text-sm font-medium text-gray-700">Melding</span>
			<Textarea
				{...createContactSubmissionAction.fields.messagekjkj.as('text')}
				rows={5}
				placeholder="Din melding her..."
				required
			/>
		</label>

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
