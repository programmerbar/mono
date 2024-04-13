<script>
	import Button from './ui/Button.svelte';
	import FormControl from './ui/FormControl.svelte';
	import Input from './ui/Input.svelte';
	import Label from './ui/Label.svelte';
	import Textarea from './ui/Textarea.svelte';
</script>

<div class="py-10">
	<h2 class="text-3xl font-medium pb-4">Kontakt oss</h2>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
					<Textarea rows={5} id="message" name="message" placeholder="Din melding..." />
				</FormControl>

				<Button>Send inn</Button>
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
