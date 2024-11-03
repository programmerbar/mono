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
			class="rounded-xl shadow-lg"
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="email" class="label">Email</label>
		<input
			type="email"
			id="email"
			name="email"
			placeholder="kari@norge.no"
			class="rounded-xl shadow-lg"
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="message" class="label">Message</label>
		<textarea
			id="message"
			name="message"
			rows={5}
			placeholder="Din melding her..."
			class="rounded-xl shadow-lg"
		></textarea>
	</div>

	<button
		type="submit"
		class="flex h-10 w-full items-center justify-center rounded-lg border-2 border-primary-dark bg-primary-light px-3 py-2 font-medium text-gray-800 shadow-lg transition hover:bg-primary"
		>Send inn</button
	>
</form>
