import type { GetProductsQueryResult } from '../../sanity.types';
import type { FilterState } from './states/filter-state.svelte';

export const filterProducts = (products: GetProductsQueryResult, filter: FilterState) => {
	const filteredProducts = products.filter((product) => {
		if (filter.hideSoldOut && product.isSoldOut) {
			return false;
		}

		if (filter.type && !product.productTypes?.map((type) => type._id).includes(filter.type)) {
			return false;
		}

		if (filter.search && !product.name.toLowerCase().includes(filter.search.toLowerCase())) {
			return false;
		}

		return true;
	});

	const sortedProducts = filteredProducts.sort((a, b) => {
		if (filter.sort === 'name-asc') {
			return a.name.localeCompare(b.name);
		}

		if (filter.sort === 'name-desc') {
			return b.name.localeCompare(a.name);
		}

		if (filter.sort === 'price-asc') {
			return a.priceList.student - b.priceList.student;
		}

		if (filter.sort === 'price-desc') {
			return b.priceList.student - a.priceList.student;
		}

		if (filter.sort === 'alcohol-asc') {
			if (a.alcoholContent === null) {
				return -1;
			}

			if (b.alcoholContent === null) {
				return 1;
			}

			return a.alcoholContent - b.alcoholContent;
		}

		if (filter.sort === 'alcohol-desc') {
			if (a.alcoholContent === null) {
				return 1;
			}

			if (b.alcoholContent === null) {
				return -1;
			}

			return b.alcoholContent - a.alcoholContent;
		}

		if (filter.sort === 'volume-asc') {
			if (a.volume === null) {
				return -1;
			}

			if (b.volume === null) {
				return 1;
			}

			return a.volume - b.volume;
		}

		if (filter.sort === 'volume-desc') {
			if (a.volume === null) {
				return 1;
			}

			if (b.volume === null) {
				return -1;
			}

			return b.volume - a.volume;
		}

		return 0;
	});

	return sortedProducts;
};
