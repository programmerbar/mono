<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import CLIWindow from '$lib/components/app/CLIWindow.svelte';
</script>

<SEO
	title="Beer Pong regler"
	description="Offisielle Beer Pong regler for Programmerbar. Lær spillreglene for våre beer pong turneringer og arrangementer."
	keywords="beer pong, regler, spill, turnering, programmerbar, studentbar, konkurranse"
	canonical="/beer-pong"
	type="article"
/>

<CLIWindow title="cat beer-pong-regler.txt" class="mx-auto max-w-screen-md">
	<!-- Window Content -->
	<div class="p-6 md:p-8">
		<h2 class="text-foreground-primary mb-12 text-3xl font-semibold md:text-4xl">
			<span class="text-foreground-muted">##</span> "Beer Pong"-regler
		</h2>

		<ul class="space-y-6 text-lg">
			<li class="border-primary border-l-4 pl-4">
				<span class="text-foreground-primary font-semibold">Første kast:</span>
				<span class="text-foreground-secondary">
					Hvem som får det første kastet avgjøres ved stein, saks, papir.
				</span>
			</li>

			<li class="border-primary border-l-4 pl-4">
				<span class="text-foreground-primary font-semibold">Velt:</span>
				<span class="text-foreground-secondary">
					Før start skal laget sørge for at alle kopper har tilstrekkelig med vann. Dersom en kopp
					velter en kopp under spillet er den regnet som truffet og fjernes fra bordet.
				</span>
			</li>

			<li class="border-primary border-l-4 pl-4">
				<span class="text-foreground-primary font-semibold">Albue:</span>
				<span class="text-foreground-secondary"
					>Albuen skal være bak kanten av bordet ved kast.</span
				>
			</li>

			<li class="border-primary border-l-4 pl-4">
				<span class="text-foreground-primary font-semibold">Blåsing:</span>
				<span class="text-foreground-secondary">
					Dersom ballen ruller i koppen uten å ha truffet vannet, kan man blåse ballen ut av koppen.
				</span>
			</li>

			<li class="border-primary border-l-4 pl-4">
				<span class="text-foreground-primary font-semibold">Dobbeltreff:</span>
				<span class="text-foreground-secondary">
					Dersom et lag treffer begge kast, i forskjellige kopper, får de ballene tilbake.
				</span>
			</li>

			<li class="border-primary border-l-4 pl-4">
				<span class="text-foreground-primary font-semibold">To i samme:</span>
				<span class="text-foreground-secondary">
					Dersom et lag treffer begge kast i samme kopp, fjernes tre kopper, men de får ikke ballene
					tilbake. Laget som mister kppene velger selv hvilke kopper som fjernes.
				</span>
			</li>

			<li class="border-primary border-l-4 pl-4">
				<span class="text-foreground-primary font-semibold">Bounce:</span>
				<span class="text-foreground-secondary">
					Dersom ballen spretter i bordet før den treffer koppen, fjernes en ekstra kopp. En ball
					som har vært i bordet kan fanges av motstanderlaget.
				</span>
			</li>

			<li class="border-primary border-l-4 pl-4">
				<span class="text-foreground-primary font-semibold">Rollback:</span>
				<span class="text-foreground-secondary">
					Dersom en ball ruller i bordet før den treffer koppen, fjernes en ekstra kopp. En ball som
					har vært i bordet kan fanges av motstanderlaget.
				</span>
			</li>

			<li class="border-primary border-l-4 pl-4">
				<span class="text-foreground-primary font-semibold">Antall kast:</span>
				<span class="text-foreground-secondary">
					Antall kast per deltaker på laget må være jevnt fordelt for hver andre runde.
				</span>
			</li>

			<li class="border-primary border-l-4 pl-4">
				<span class="text-foreground-primary font-semibold">Restack:</span>
				<span class="text-foreground-secondary">
					Laget kan når som helst be om å få gjennomføre èn restack. Formasjonen kan ikke være
					større enn 3 kopper i høyden.
				</span>
			</li>

			<li class="border-primary border-l-4 pl-4">
				<span class="text-foreground-primary font-semibold">Redemption:</span>
				<span class="text-foreground-secondary">
					Dersom laget som startet vinner kampen, har motstanderlaget krav på redemption. Dersom
					motstanderlaget gjør rent bort, fortsetter kampen fra samme oppstilling som før runden.
				</span>
			</li>

			<li class="border-primary border-l-4 pl-4">
				<span class="text-foreground-primary font-semibold">Fiksing:</span>
				<span class="text-foreground-secondary">
					Et lag kan når som helst be motstanderlaget fikse på koppene deres, slik at de står inntil
					hverandre.
				</span>
			</li>
		</ul>

		<p class="text-foreground-muted mt-8 text-sm">
			<a
				href="https://github.com/programmerbar/mono"
				class="hover:text-primary transition-colors"
				target="_blank"
				rel="noopener noreferrer"
			>
				<span class="text-foreground-subtle">#</span> Foreslå en endring
			</a>
		</p>
	</div>
</CLIWindow>
