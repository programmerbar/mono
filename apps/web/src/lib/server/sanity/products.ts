import { sanity } from './client';
import { type Product } from '$lib/types';

export const getProducts = async () => {
	const query = `*[_type == "product" && !(_id in path("drafts.**"))] {
        name,
        "productType": productType->{
            _id,
            title
        },
        isSoldOut,
        price,
        "image": image.asset->url,
        "producer": producer->name,
        volume,
        variants,
    }`;

	return await sanity.fetch<Array<Product>>(query);
};
