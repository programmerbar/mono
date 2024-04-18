export type ProductType = {
	_id: string;
	title: string;
};

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
	_id: string;
	name: string;
	description: string | null;
	isSoldOut: boolean;
	productTypes: Array<ProductType> | null;
	alcoholContent: number | null;
	price: number;
	image: string | null;
	producer: string | null;
	volume: number | null;
	variants: Array<string> | null;
};
