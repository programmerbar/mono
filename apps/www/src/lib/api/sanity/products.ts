import { sanityClient } from './client';
import groq from 'groq';
import type { GetProductByIdQueryResult, GetProductsQueryResult } from '../../../../sanity.types';

const getProductsQuery = groq`*[_type == "product" && !(_id in path("drafts.**"))] {
    _id,
    sku,
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

export const getProducts = async () => {
	return await sanityClient.fetch<GetProductsQueryResult>(getProductsQuery);
};

const getProductByIdQuery = groq`*[_type == "product" && _id == $id && !(_id in path("drafts.**"))] {
    _id,
    sku,
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

export const getProductById = async (id: string) => {
	return await sanityClient.fetch<GetProductByIdQueryResult>(getProductByIdQuery, { id });
};
