import groq from "groq";

export const GET_PRODUCTS_QUERY = groq`*[_type == "product" && !(_id in path("drafts.**"))] {
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

export const GET_PRODUCT_BY_ID_QUERY = groq`*[_type == "product" && _id == $id && !(_id in path("drafts.**"))] {
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
