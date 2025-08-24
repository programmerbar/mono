import type { GetProductsQueryResult } from '../../sanity.types';

export const extractTypes = (products: GetProductsQueryResult) => {
	return products
		.flatMap((product) => product.productTypes)
		.filter(Boolean)
		.reduce(
			(acc, type) => {
				if (!type) return acc;
				if (!acc.some((t) => t._id === type?._id)) {
					acc.push(type);
				}
				return acc;
			},
			[] as Array<Exclude<GetProductsQueryResult[number]['productTypes'], null>[number]>
		);
};
