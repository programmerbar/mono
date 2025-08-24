export interface TrainingItem {
	id: number;
	title: string;
	description: string;
	completed: boolean;
	category: string;
}

export const TRAINING_CATEGORIES = {
	BAR_USAGE: 'Bruk av bar',
	LAWS_SAFETY: 'Lover og sikkerhet',
	HYGIENE_CLEANING: 'Vask og hygiene'
} as const;

export const DEFAULT_TRAINING_ITEMS: TrainingItem[] = [
	{
		id: 1,
		title: 'Bytte keg på en riktig måte',
		description: 'Lært at kegs burde bli oppbevart kjølig og stående kaldt for å holde seg',
		completed: false,
		category: TRAINING_CATEGORIES.BAR_USAGE
	},
	{
		id: 2,
		title: 'Tappe pils på en riktig måte',
		description: 'Riktig tapping av øl',
		completed: false,
		category: TRAINING_CATEGORIES.BAR_USAGE
	},
	{
		id: 3,
		title: 'Glassvasken',
		description: 'Skru på/av glassvasken, tømme og skylle glass før maskinen',
		completed: false,
		category: TRAINING_CATEGORIES.BAR_USAGE
	},
	{
		id: 4,
		title: 'Isbiter og isbitmaskin',
		description: 'Bruke dedikert isbit "skje", sjekke at maskinen er på og lager isbiter',
		completed: false,
		category: TRAINING_CATEGORIES.BAR_USAGE
	},
	{
		id: 5,
		title: 'Kassesystem',
		description:
			'Åpne kassen, ta imot betaling (vanlig pris og internpris), slette/redigere priser, stenge kassen',
		completed: false,
		category: TRAINING_CATEGORIES.BAR_USAGE
	},
	{
		id: 6,
		title: 'Påfyll av varer',
		description: 'Fylle på varer kontinuerlig, spesielt mot slutten av vakten',
		completed: false,
		category: TRAINING_CATEGORIES.BAR_USAGE
	},
	{
		id: 7,
		title: 'Temperatursjekk',
		description: 'Sjekke temperatur på kjøleskap (skal bli skrevet ned)',
		completed: false,
		category: TRAINING_CATEGORIES.BAR_USAGE
	},
	{
		id: 8,
		title: 'Ikke oversjenke',
		description: 'Aldri oversjenke da dette er ulovlig',
		completed: false,
		category: TRAINING_CATEGORIES.LAWS_SAFETY
	},
	{
		id: 9,
		title: 'Autoritet til å si nei',
		description: 'Har autoritet til å si nei til å servere alkohol',
		completed: false,
		category: TRAINING_CATEGORIES.LAWS_SAFETY
	},
	{
		id: 10,
		title: 'Skjenkeløyve og dokumenter',
		description: 'Hvor skjenkeløyve og opplæringsskjema er i baren, i tilfelle kontroll',
		completed: false,
		category: TRAINING_CATEGORIES.LAWS_SAFETY
	},
	{
		id: 11,
		title: 'Nødsituasjoner',
		description: 'Vite hva å gjøre i nødsituasjon, for eksempel brann',
		completed: false,
		category: TRAINING_CATEGORIES.LAWS_SAFETY
	},
	{
		id: 12,
		title: 'Fast skjenkeløyve',
		description: 'Baren har fast skjenkeløyve som vi kan miste hvis vi får for mange prikker',
		completed: false,
		category: TRAINING_CATEGORIES.LAWS_SAFETY
	},
	{
		id: 13,
		title: 'Alkoholreklame',
		description:
			'Ikke lov til å reklamere for alkohol, ikke foreslå alkohol men spørre "Hva vil du ha?"',
		completed: false,
		category: TRAINING_CATEGORIES.LAWS_SAFETY
	},
	{
		id: 14,
		title: 'Renhold i baren',
		description:
			'Viktigheten av å holde det rent i baren og på lageret (før, under og etter servering)',
		completed: false,
		category: TRAINING_CATEGORIES.HYGIENE_CLEANING
	},
	{
		id: 15,
		title: 'Personlig hygiene',
		description: 'Viktigheten av å ha god personlig hygiene',
		completed: false,
		category: TRAINING_CATEGORIES.HYGIENE_CLEANING
	},
	{
		id: 16,
		title: 'Håndvask',
		description: 'Hvordan vaske hendene ordentlig',
		completed: false,
		category: TRAINING_CATEGORIES.HYGIENE_CLEANING
	},
	{
		id: 17,
		title: 'Rengjøring av arbeidsflater',
		description: 'Hvordan tørke over benk og vask av gulv',
		completed: false,
		category: TRAINING_CATEGORIES.HYGIENE_CLEANING
	},
	{
		id: 18,
		title: 'Søppelhåndtering',
		description: 'Hva å gjøre med papp og annet søppel, og koden til søppelstasjonen',
		completed: false,
		category: TRAINING_CATEGORIES.HYGIENE_CLEANING
	},
	{
		id: 19,
		title: 'Vask etter kegbytte',
		description: 'Bytter man keg, så vasker man hendene',
		completed: false,
		category: TRAINING_CATEGORIES.HYGIENE_CLEANING
	},
	{
		id: 20,
		title: 'Rengjøring av barutstyr',
		description:
			'Vask og rengjør barutstyr, f.eks. tappetårn, målebeger, shaker, isøse, barskje osv.',
		completed: false,
		category: TRAINING_CATEGORIES.HYGIENE_CLEANING
	}
];
