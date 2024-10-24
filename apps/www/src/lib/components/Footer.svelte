<script lang="ts">
	import lervigLogo from '$lib/assets/lervig-logo-black.png';
</script>

<div class="relative mt-24 border-t-2 border-primary-dark bg-primary-light">
	<div class="absolute bottom-0 left-0 flex items-center gap-2 px-2 py-1 text-xs text-gray-700">
		<a class="hover:underline" href="https://programmerbar.sanity.studio">Sanity</a>
		<a class="hover:underline" target="_blank" href="https://github.com/programmerbar/mono"
			>GitHub</a
		>
		<a class="hover:underline" href="/beer-pong">Beer Pong</a>
	</div>

	<footer
		class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-10 px-4 py-16 md:flex-row"
	>
		<div class="text-center md:text-left">
			<p class="text-lg font-medium">Informasjon</p>
			<ul>
				<li>
					<p>echo Programmerbar</p>
				</li>
				<li>
					<p>
						Org. nr.: <a
							class="hover:underline"
							href="https://www.proff.no/selskap/echo-programmerbar/bergen/medlemsorganisasjoner/IFC3FCQ10PU/"
							>927 307 898</a
						>
					</p>
				</li>
			</ul>
		</div>

		<div class="space-y-4 text-center">
			<p class="mx-auto text-xl font-medium">Hovedsamarbeidspartner</p>
			<div>
				<a href="https://lervig.no">
					<img src={lervigLogo} alt="Lervig" class="mx-auto h-24 w-auto" /></a
				>
			</div>
		</div>

		<div class="text-center md:text-right">
			<p class="text-lg font-medium">Kontakt oss</p>
			<ul>
				<li>
					<a class="hover:underline" href="https://www.instagram.com/echo_programmerbar">
						@echo_programmerbar
					</a>
				</li>
				<li>
					<a class="hover:underline" href="mailto:hei@programmerbar.no">hei@programmerbar.no</a>
				</li>
			</ul>
		</div>
	</footer>
</div>
