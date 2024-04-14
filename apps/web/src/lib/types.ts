export type Event = {
	title: string;
	slug: string;
	start: string;
	end: string;
	isPrivate: boolean;
	registrationLink: string | null;
	body: string;
};

export type Product = {
	name: string;
	price: number;
	image: string | null;
	producer: string | null;
	volume: number | null;
	variants: Array<string> | null;
};
