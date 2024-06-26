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
    priceList,
    image,
    "producer": producer->name,
    volume,
    alcoholContent,
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
    priceList,
    image,
    "producer": producer->name,
    volume,
    alcoholContent,
    variants,
}[0]`;

	return await sanity.fetch<Product | null>(query, { id });
};
