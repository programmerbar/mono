<svelte:head>
	<title>Beer Pong</title>
</svelte:head>

<main class="mx-auto max-w-screen-md rounded-xl border-2 bg-background p-8 py-24">
	<h1 class="mb-16 text-center font-mono text-4xl font-medium md:text-5xl">"Beer Pong"-regler</h1>

	<ul class="space-y-8 text-xl">
		<li>
			<span class="font-medium">Første kast:</span>

			Hvem som får det første kastet avgjøres ved stein, saks, papir.
		</li>

		<li>
			<span class="font-medium">Velt:</span>

			Før start skal laget sørge for at alle kopper har tilstrekkelig med vann. Dersom en kopp
			velter en kopp under spillet er den regnet som truffet og fjernes fra bordet.
		</li>

		<li>
			<span class="font-medium">Albue:</span>

			Albuen skal være bak kanten av bordet ved kast.
		</li>

		<li>
			<span class="font-medium">Blåsing:</span>

			Dersom ballen ruller i koppen uten å ha truffet vannet, kan man blåse ballen ut av koppen.
		</li>

		<li>
			<span class="font-medium">Dobbeltreff:</span>

			Dersom et lag treffer begge kast, i forskjellige kopper, får de ballene tilbake.
		</li>

		<li>
			<span class="font-medium">To i samme:</span>

			Dersom et lag treffer begge kast i samme kopp, fjernes tre kopper, men de får ikke ballene
			tilbake. Laget som mister kppene velger selv hvilke kopper som fjernes.
		</li>

		<li>
			<span class="font-medium">Bounce:</span>

			Dersom ballen spretter i bordet før den treffer koppen, fjernes en ekstra kopp. En ball som
			har vært i bordet kan fanges av motstanderlaget.
		</li>

		<li>
			<span class="font-medium">Rollback:</span>

			Dersom en ball ruller i bordet før den treffer koppen, fjernes en ekstra kopp. En ball som har
			vært i bordet kan fanges av motstanderlaget.
		</li>

		<li>
			<span class="font-medium">Antall kast:</span>

			Antall kast per deltaker på laget må være jevnt fordelt for hver andre runde.
		</li>

		<li>
			<span class="font-medium">Restack:</span>

			Laget kan når som helst be om å få gjennomføre èn restack. Formasjonen kan ikke være større
			enn 3 kopper i høyden.
		</li>

		<li>
			<span class="font-medium">Redemption:</span>

			Dersom laget som startet vinner kampen, har motstanderlaget krav på redemption. Dersom
			motstanderlaget gjør rent bort, fortsetter kampen fra samme oppstilling som før runden.
		</li>

		<li>
			<span class="font-medium">Fiksing</span>

			Et lag kan når som helst be motstanderlaget fikse på koppene deres, slik at de står inntil
			hverandre.
		</li>
	</ul>

	<p class="mt-8 text-sm text-gray-600 hover:underline">
		<a href="https://github.com/programmerbar/mono">Foreslå en endring &rarr;</a>
	</p>
</main>
