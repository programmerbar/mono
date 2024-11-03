<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<li class="font-mono">
	<form method="post" action="/auth/logg-ut" use:enhance>
		<button type="submit" class="text-xl font-semibold text-gray-700 hover:underline"
			>/logg ut</button
		>
	</form>
</li>
