export interface TrainingItem {
	id: number;
	title: string;
	description: string;
	completed: boolean;
	category: string;
}

export const TRAINING_CATEGORIES = {
	STARTUP: 'Oppstart',
	REGISTER: 'Kasse',
	BAR_OPERATIONS: 'Bardrift',
	HYGIENE: 'Hygiene',
	LAWS_SAFETY: 'Lover og sikkerhet'
} as const;

export const DEFAULT_TRAINING_ITEMS: TrainingItem[] = [
	{
		id: 1,
		title: 'Åpne kasse',
		description: 'Logg inn, åpne kassen og gjør den klar til å ta imot betaling',
		completed: false,
		category: TRAINING_CATEGORIES.STARTUP
	},
	{
		id: 2,
		title: 'Skru på oppvaskmaskin',
		description: 'Skru på glassvasken, og kontroller at den fylles og blir varm',
		completed: false,
		category: TRAINING_CATEGORIES.STARTUP
	},
	{
		id: 3,
		title: 'Åpne porten',
		description: 'Åpne porten og sikre at inngangen er klar før baren åpner',
		completed: false,
		category: TRAINING_CATEGORIES.STARTUP
	},
	{
		id: 4,
		title: 'Sjekk sortiment i kjøleskapet',
		description: 'Sjekk at kjøleskapet har riktig sortiment, og fyll på det som mangler',
		completed: false,
		category: TRAINING_CATEGORIES.STARTUP
	},
	{
		id: 5,
		title: 'Kassebeholdning',
		description: 'Tell kassebeholdningen og kontroller at beløpet stemmer før åpning',
		completed: false,
		category: TRAINING_CATEGORIES.REGISTER
	},
	{
		id: 6,
		title: 'Ta imot betaling',
		description:
			'Velg riktig pris for student, ekstern eller intern, og registrer betalingen i kassen',
		completed: false,
		category: TRAINING_CATEGORIES.REGISTER
	},
	{
		id: 7,
		title: 'Bonger',
		description: 'Kontroller at bongen er gyldig, og registrer riktig vare i kassen',
		completed: false,
		category: TRAINING_CATEGORIES.REGISTER
	},
	{
		id: 8,
		title: 'Gavekort',
		description: 'Kontroller gavekortet, og registrer beløpet riktig i kassen',
		completed: false,
		category: TRAINING_CATEGORIES.REGISTER
	},
	{
		id: 9,
		title: 'Dagsoppgjør',
		description: 'Steng kassen, tell beholdningen og kontroller at oppgjøret stemmer',
		completed: false,
		category: TRAINING_CATEGORIES.REGISTER
	},
	{
		id: 10,
		title: 'Glass',
		description:
			'Bruk riktig glass til riktig drikke, ikke stable glass, og fjern skitne eller skadde glass',
		completed: false,
		category: TRAINING_CATEGORIES.BAR_OPERATIONS
	},
	{
		id: 11,
		title: 'Løpende påfylling av varer',
		description: 'Fylle på varer kontinuerlig, spesielt mot slutten av vakten',
		completed: false,
		category: TRAINING_CATEGORIES.BAR_OPERATIONS
	},
	{
		id: 12,
		title: 'Isbitmaskin',
		description: 'Bruke dedikert isbit "skje", sjekke at maskinen er på og lager isbiter',
		completed: false,
		category: TRAINING_CATEGORIES.BAR_OPERATIONS
	},
	{
		id: 13,
		title: 'Oppvaskmaskin',
		description: 'Tømme og skylle glass før maskinen, og skru av og tømme glassvasken etter bruk',
		completed: false,
		category: TRAINING_CATEGORIES.BAR_OPERATIONS
	},
	{
		id: 14,
		title: 'Bruke tappetårnet',
		description: 'Riktig tapping av øl',
		completed: false,
		category: TRAINING_CATEGORIES.BAR_OPERATIONS
	},
	{
		id: 15,
		title: 'Bytte keg',
		description: 'Lært at kegs burde bli oppbevart kjølig og stående kaldt for å holde seg',
		completed: false,
		category: TRAINING_CATEGORIES.BAR_OPERATIONS
	},
	{
		id: 16,
		title: 'Resette skumlås',
		description: 'Reset skumlåsen når tappelinjen bare gir skum etter et kegbytte',
		completed: false,
		category: TRAINING_CATEGORIES.BAR_OPERATIONS
	},
	{
		id: 17,
		title: 'Hvor ligger vaskesaker?',
		description: 'Finn fram vaskesaker og riktig rengjøringsutstyr til de ulike områdene',
		completed: false,
		category: TRAINING_CATEGORIES.HYGIENE
	},
	{
		id: 18,
		title: 'Rengjøring av barområdet',
		description:
			'Viktigheten av å holde det rent i baren og på lageret (før, under og etter servering)',
		completed: false,
		category: TRAINING_CATEGORIES.HYGIENE
	},
	{
		id: 19,
		title: 'Personlig hygiene',
		description:
			'Viktigheten av å ha god personlig hygiene: ingen pelling, rene hender og anstendighet',
		completed: false,
		category: TRAINING_CATEGORIES.HYGIENE
	},
	{
		id: 20,
		title: 'Søppelhåndtering',
		description: 'Hva å gjøre med restavfall, papp og glass, og koden til søppelstasjonen',
		completed: false,
		category: TRAINING_CATEGORIES.HYGIENE
	},
	{
		id: 21,
		title: 'Overskjenking',
		description: 'Aldri oversjenke da dette er ulovlig',
		completed: false,
		category: TRAINING_CATEGORIES.LAWS_SAFETY
	},
	{
		id: 22,
		title: 'Autoritet til å si nei',
		description: 'Har autoritet til å si nei til å servere alkohol',
		completed: false,
		category: TRAINING_CATEGORIES.LAWS_SAFETY
	},
	{
		id: 23,
		title: 'Dokumenter ved kontroll',
		description: 'Hvor skjenkeløyve og opplæringsskjema er i baren, i tilfelle kontroll',
		completed: false,
		category: TRAINING_CATEGORIES.LAWS_SAFETY
	},
	{
		id: 24,
		title: 'Nødsituasjoner',
		description: 'Vite hva å gjøre i nødsituasjon, for eksempel brann',
		completed: false,
		category: TRAINING_CATEGORIES.LAWS_SAFETY
	},
	{
		id: 25,
		title: 'Fast skjenkebevilling',
		description: 'Baren har fast skjenkeløyve som vi kan miste hvis vi får for mange prikker',
		completed: false,
		category: TRAINING_CATEGORIES.LAWS_SAFETY
	},
	{
		id: 26,
		title: 'Alkoholreklame',
		description:
			'Ikke lov til å reklamere for alkohol, ikke foreslå alkohol men spørre "Hva vil du ha?"',
		completed: false,
		category: TRAINING_CATEGORIES.LAWS_SAFETY
	}
];
