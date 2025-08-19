import type { GetProductsQueryResult } from '../../sanity.types';

export const extractBreweries = (products: GetProductsQueryResult) => {
	return products
		.map((product) => product.producer)
		.filter(Boolean)
		.reduce((acc, producer) => {
			if (!acc.includes(producer!)) {
				acc.push(producer!);
			}
			return acc;
		}, [] as Array<string>)
		.sort();
};
