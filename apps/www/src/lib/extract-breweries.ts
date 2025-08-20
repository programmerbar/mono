import type { GetProductsQueryResult } from '../../sanity.types';

export const extractBreweries = (products: GetProductsQueryResult) => {
	const producers = products
		.map((product) => product.producer)
		.filter(Boolean)
		.reduce((acc, producer) => {
			if (!acc.includes(producer!)) {
				acc.push(producer!);
			}
			return acc;
		}, [] as Array<string>)
		.sort();

	// Check if there are any products without producers
	const hasProductsWithoutProducers = products.some((product) => !product.producer);

	if (hasProductsWithoutProducers) {
		// Add "No brewery" option at the beginning
		return ['__no_brewery__', ...producers];
	}

	return producers;
};
