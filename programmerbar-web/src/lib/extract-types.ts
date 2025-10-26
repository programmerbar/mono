import type { GET_PRODUCTS_QUERYResult } from '@programmerbar/cms/types';

export const extractTypes = (products: GET_PRODUCTS_QUERYResult) => {
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
			[] as Array<Exclude<GET_PRODUCTS_QUERYResult[number]['productTypes'], null>[number]>
		);
};
