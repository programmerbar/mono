<script lang="ts">
	import lervigLogo from '$lib/assets/lervig-logo-black.png';
	import { getUser } from '$lib/context/user.context';

	let user = getUser();
</script>

<div class="border-primary-dark bg-primary-light relative mt-24 border-t-2">
	<footer class="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-16">
		<div class="mx-auto flex w-full flex-col items-center justify-between gap-10 md:flex-row">
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
		</div>

		<div class="py-4 text-center">
			<p class="text-lg font-medium">Lenker</p>
			<ul class="mx-auto flex w-fit flex-col items-center gap-x-4 md:flex-row">
				<li>
					<a class="hover:underline" target="_blank" href="https://programmerbar.sanity.studio"
						>Sanity</a
					>
				</li>
				<li>
					<a class="hover:underline" target="_blank" href="https://github.com/programmerbar/mono"
						>GitHub</a
					>
				</li>
				<li>
					<a class="hover:underline" href="/beer-pong">Beer Pong</a>
				</li>
				{#if $user}
					<li>
						<a class="hover:underline" href="/portal">Portal</a>
					</li>
				{/if}
				{#if $user}
					<li>
						<a class="hover:underline" href="/emeritus">Emeritus</a>
					</li>
				{/if}
				{#if !$user}
					<li>
						<a class="hover:underline" href="/logg-inn">Logg inn</a>
					</li>
				{/if}
			</ul>
		</div>
	</footer>
</div>
