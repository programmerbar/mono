<script>
	import Button from './ui/Button.svelte';
	import FormControl from './ui/FormControl.svelte';
	import Input from './ui/Input.svelte';
	import Label from './ui/Label.svelte';
</script>

<div class="py-10">
	<h2 class="text-3xl font-medium pb-4">Kontakt oss</h2>

	<div class="grid grid-cols-2 gap-4">
		<div>
			<form class="space-y-4">
				<FormControl>
					<Label for="name">Navn</Label>
					<Input type="text" id="name" name="name" placeholder="Kari Nordmann" />
				</FormControl>
				<FormControl>
					<Label for="email">E-post</Label>
					<Input type="email" id="email" name="email" placeholder="kari.nordmann@norge.no" />
				</FormControl>
				<FormControl>
					<Label for="message">Melding</Label>
					<textarea
						rows="5"
						id="message"
						name="message"
						class="bg-gray-100 rounded-md border p-2 shadow"
						placeholder="Din melding..."
					/>
				</FormControl>

				<Button>Send inn</Button>
			</form>
		</div>

		<div class="w-full rounded-md overflow-hidden shadow">
			<iframe
				title="Map"
				width="100%"
				height="600"
				frameborder="0"
				scrolling="no"
				marginheight="0"
				marginwidth="0"
				src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=thorm%C3%B8hlensgate%2055+(H%C3%B8yteknologisenteret)&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
			></iframe>
		</div>
	</div>
</div>
