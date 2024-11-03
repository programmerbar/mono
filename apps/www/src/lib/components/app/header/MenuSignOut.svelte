<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<li class="flex w-full text-left font-mono hover:bg-gray-100">
	<form method="post" action="/auth/logg-ut" use:enhance>
		<button
			type="submit"
			class="w-full px-4 py-2 text-3xl font-medium text-gray-700 hover:underline">/logg ut</button
		>
	</form>
</li>
