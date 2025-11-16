<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<li class="hover:bg-card-hover flex w-full text-left font-mono transition-colors">
	<form method="post" action="/auth/logg-ut" use:enhance>
		<button
			type="submit"
			class="text-foreground-primary hover:text-primary w-full px-4 py-2 text-3xl font-medium transition-colors hover:underline"
			>/logg ut</button
		>
	</form>
</li>
