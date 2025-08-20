import type { GetProductsQueryResult } from '../../sanity.types';

export const extractPriceRange = (
	products: GetProductsQueryResult,
	useStudentPrice: boolean = true
) => {
	if (products.length === 0) {
		return { min: 0, max: 100 };
	}

	const prices = products.map((product) =>
		useStudentPrice ? product.priceList.student : product.priceList.ordinary
	);

	const min = Math.min(...prices);
	const max = Math.max(...prices);

	// Round down min to nearest 5, round up max to nearest 5 for nicer numbers
	return {
		min: Math.floor(min / 5) * 5,
		max: Math.ceil(max / 5) * 5
	};
};
