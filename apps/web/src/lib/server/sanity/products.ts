import { sanity } from './client';

export type Product = {
	name: string;
	price: number;
	image: string | null;
	producer: string | null;
};

export const getProducts = async () => {
	const query = `*[_type == "product"] {
        name,
        price,
        "image": image.asset->url,
        "producer": producer->name
    }`;

	return await sanity.fetch<Array<Product>>(query);
};
