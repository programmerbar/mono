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
	name: string;
	isSoldOut: boolean;
	productType: ProductType | null;
	price: number;
	image: string | null;
	producer: string | null;
	volume: number | null;
	variants: Array<string> | null;
};
