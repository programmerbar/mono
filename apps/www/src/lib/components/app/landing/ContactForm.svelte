<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<form method="post" action="/kontakt-oss" class="space-y-4" use:enhance>
	<div class="flex flex-col gap-1">
		<label for="name" class="label">Name</label>
		<input
			type="text"
			id="name"
			name="name"
			placeholder="Kari Nordmann"
			class="shadow-lg rounded-xl"
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="email" class="label">Email</label>
		<input
			type="email"
			id="email"
			name="email"
			placeholder="kari@norge.no"
			class="shadow-lg rounded-xl"
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="message" class="label">Message</label>
		<textarea
			id="message"
			name="message"
			rows={5}
			placeholder="Din melding her..."
			class="shadow-lg rounded-xl"
		></textarea>
	</div>

	<button
		type="submit"
		class="flex items-center justify-center font-medium w-full h-10 px-3 py-2 text-gray-800 rounded-lg shadow-lg bg-primary-light border-2 border-primary-dark transition hover:bg-primary"
		>Send inn</button
	>
</form>
