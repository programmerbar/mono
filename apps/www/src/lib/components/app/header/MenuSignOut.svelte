<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<li class="flex w-full font-mono text-left hover:bg-gray-100">
	<form method="post" action="/auth/logg-ut" use:enhance>
		<button
			type="submit"
			class="hover:underline w-full py-2 px-4 text-gray-700 text-3xl font-medium">/logg ut</button
		>
	</form>
</li>
