<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<li class="font-mono">
	<form method="post" action="/auth/logg-ut" use:enhance>
		<button type="submit" class="hover:underline text-gray-700 text-xl font-semibold"
			>/logg ut</button
		>
	</form>
</li>
