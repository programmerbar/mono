import { sanity } from './client';
import { type Product } from '$lib/types';

export const getProducts = async () => {
	const query = `*[_type == "product" && !(_id in path("drafts.**"))] {
        name,
        "productTypes": productType[]->{
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

	const res = await sanity.fetch<Array<Product>>(query);

	console.log(res.find((product) => product.name.startsWith('Pilsner LITE')));

	return res;
};
