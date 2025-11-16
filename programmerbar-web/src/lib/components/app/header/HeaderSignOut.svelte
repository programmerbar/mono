<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<li class="font-mono">
	<form method="post" action="/auth/logg-ut" use:enhance>
		<button
			type="submit"
			class="text-foreground-primary hover:text-primary text-xl font-semibold transition-colors hover:underline"
			>/logg ut</button
		>
	</form>
</li>
