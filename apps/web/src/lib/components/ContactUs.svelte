<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import Button from './ui/Button.svelte';
	import FormControl from './ui/FormControl.svelte';
	import Input from './ui/Input.svelte';
	import Label from './ui/Label.svelte';
	import Textarea from './ui/Textarea.svelte';

	let errors = $state<{
		name: Array<string>;
		email: Array<string>;
		message: Array<string>;
	}>({
		name: [],
		email: [],
		message: []
	});
</script>

<div class="py-10">
	<h2 class="text-3xl font-medium pb-4">Kontakt oss</h2>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-4">
		<div>
			<form
				method="post"
				action="/contact-us"
				class="space-y-4"
				use:enhance={({ formData, cancel }) => {
					const { name, email, message } = Object.fromEntries(formData.entries());

					if (!name) {
						errors.name = ['Navn er påkrevd'];
					} else {
						errors.name = [];
					}

					if (!email) {
						errors.email = ['E-post er påkrevd'];
					} else {
						errors.email = [];
					}

					if (!message) {
						errors.message = ['Melding er påkrevd'];
					} else {
						errors.message = [];
					}

					if (Object.values(errors).some((error) => error.length > 0)) {
						cancel();
					}

					return async ({ result, update }) => {
						if (result.type === 'success') {
							toast.success('Meldingen ble sendt inn!');
							await update({ reset: true });
						} else {
							toast.error('Noe gikk galt. Prøv igjen senere.');
						}

						await applyAction(result);
					};
				}}
			>
				<FormControl>
					<Label required for="name">Navn</Label>
					<Input required type="text" id="name" name="name" placeholder="Kari Nordmann" />
					{#each errors.name as error}
						<p class="text-red-500 text-sm">{error}</p>
					{/each}
				</FormControl>
				<FormControl>
					<Label required for="email">E-post</Label>
					<Input
						required
						type="email"
						id="email"
						name="email"
						placeholder="kari.nordmann@norge.no"
					/>
					{#each errors.email as error}
						<p class="text-red-500 text-sm">{error}</p>
					{/each}
				</FormControl>
				<FormControl>
					<Label required for="message">Melding</Label>
					<Textarea required rows={5} id="message" name="message" placeholder="Din melding..." />
					{#each errors.message as error}
						<p class="text-red-500 text-sm">{error}</p>
					{/each}
				</FormControl>

				<input type="text" name="subject" class="hidden" />

				<Button class="w-full md:w-fit" type="submit">Send inn</Button>
			</form>
		</div>

		<div class="w-full border-2 border-black rounded-xl overflow-hidden shadow-xl">
			<iframe
				title="Programmerbar"
				width="100%"
				height="600"
				frameborder="0"
				scrolling="no"
				marginheight="0"
				marginwidth="0"
				src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Lesesalen,%20Thorm%C3%B8hlens%20Gate%2055,%205006%20Bergen+(Programmerbar)&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
			></iframe>
			<!-- <iframe width="600" height="420" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"src="https://use.mazemap.com/embed.html#v=1&campusid=340&zlevel=1&center=5.331461,60.381317&zoom=20.1&sharepoitype=poi&sharepoi=1002031847&utm_medium=iframe" style={{ border: '1px solid grey' }} allow="geolocation"></iframe><br/><small><a href="https://www.mazemap.com/">Map by MazeMap</a></small> -->
		</div>
	</div>
</div>
