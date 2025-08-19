<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
</script>

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
		<input type="text" name="name" placeholder="Kari Nordmann" class="rounded-xl shadow-lg" />
	</div>

	<div class="field">
		<label for="email" class="label">Email</label>
		<input
			type="email"
			name="email"
			placeholder="kari.nordmann@noreg.no"
			class="rounded-xl shadow-lg"
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="name" class="label">Name</label>
		<input
			type="text"
			id="name"
			name="namekjkj"
			placeholder="Kari Nordmann"
			class="rounded-xl shadow-lg"
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="email" class="label">Email</label>
		<input
			type="email"
			id="email"
			name="emailkjkj"
			placeholder="kari@norge.no"
			class="rounded-xl shadow-lg"
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="message" class="label">Message</label>
		<textarea
			id="message"
			name="messagekjkj"
			rows={5}
			placeholder="Din melding her..."
			class="rounded-xl shadow-lg"
		></textarea>
	</div>

	<button
		type="submit"
		class="border-primary-dark bg-primary-light hover:bg-primary flex h-10 w-full items-center justify-center rounded-lg border-2 px-3 py-2 font-medium text-gray-800 shadow-lg transition"
		>Send inn</button
	>
</form>

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
