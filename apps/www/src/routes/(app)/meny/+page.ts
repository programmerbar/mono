import { getProducts } from "$lib/api/sanity/products";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    const products = await getProducts();

    return {
        products
    }
}