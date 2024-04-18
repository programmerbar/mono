import { sanity } from './client';
import { type Product } from '$lib/types';

export const getProducts = async () => {
	const query = `*[_type == "product" && !(_id in path("drafts.**"))] {
        _id,
        name,
        description,
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

	return await sanity.fetch<Array<Product>>(query);
};

export const getProductById = async (id: string) => {
	const query = `*[_type == "product" && _id == $id && !(_id in path("drafts.**"))] {
        _id,
        name,
        description,
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
    }[0]`;

	return await sanity.fetch<Product | null>(query, { id });
};
