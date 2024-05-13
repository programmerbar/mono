<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
</script>

<SEO title="Logg inn" />

<div class="min-h-screen bg-[url('/circuit-board.svg')] flex flex-col items-center justify-center">
	<div
		class="p-8 sm:rounded-lg border shadow-lg max-w-[500px] w-full bg-background flex flex-col justify-center"
	>
		<div class="mb-8 md:w-3/4">
			<h1 class="text-3xl font-medium mb-3">Logg inn</h1>

			<p class="text-gray-500">
				Velg en måte å logge inn på. For å ha tilgang må du ha blitt invitert av en administrator.
			</p>
		</div>

		<a
			class="hover:underline mx-auto h-10 font-medium w-full bg-primary rounded-lg flex items-center justify-center text-white"
			href="/feide">Fortsett med Feide</a
		>

		<p class="text-center mt-8">
			<a class="hover:underline text-gray-600" href="/">Tilbake til forsiden</a>
		</p>
	</div>
</div>
