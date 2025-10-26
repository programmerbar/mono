import type { GetProductsQueryResult } from '@programmerbar/cms/types';
import type { FilterState } from './states/filter-state.svelte';

export const filterProducts = (products: GetProductsQueryResult, filter: FilterState) => {
	const filteredProducts = products.filter((product) => {
		if (filter.current.hideSoldOut && product.isSoldOut) {
			return false;
		}

		if (filter.current.types.size > 0) {
			// If product has no types, exclude it when type filtering is active
			if (!product.productTypes || product.productTypes.length === 0) {
				return false;
			}
			// Check if product has any of the selected types
			const productTypeIds = product.productTypes.map((type) => type._id);
			const hasMatchingType = productTypeIds.some((typeId) => filter.current.types.has(typeId));
			if (!hasMatchingType) {
				return false;
			}
		}

		if (filter.current.breweries.size > 0) {
			// Check if "No brewery" is selected
			const hasNoBrewer = filter.current.breweries.has('__no_brewery__');
			// Check if product has a matching producer
			const hasMatchingProducer =
				product.producer && filter.current.breweries.has(product.producer);
			// Check if product has no producer and "No brewery" is selected
			const isNoProducerMatch = !product.producer && hasNoBrewer;

			if (!hasMatchingProducer && !isNoProducerMatch) {
				return false;
			}
		}

		if (filter.current.priceRange) {
			const price = filter.current.showStudentPrice
				? product.priceList.student
				: product.priceList.ordinary;
			if (price < filter.current.priceRange.min || price > filter.current.priceRange.max) {
				return false;
			}
		}

		if (
			filter.current.search &&
			!product.name.toLowerCase().includes(filter.current.search.toLowerCase())
		) {
			return false;
		}

		return true;
	});

	const sortedProducts = filteredProducts.sort((a, b) => {
		if (filter.current.sort === 'name-asc') {
			return a.name.localeCompare(b.name);
		}

		if (filter.current.sort === 'name-desc') {
			return b.name.localeCompare(a.name);
		}

		if (filter.current.sort === 'price-asc') {
			return a.priceList.student - b.priceList.student;
		}

		if (filter.current.sort === 'price-desc') {
			return b.priceList.student - a.priceList.student;
		}

		if (filter.current.sort === 'alcohol-asc') {
			if (a.alcoholContent === null) {
				return -1;
			}

			if (b.alcoholContent === null) {
				return 1;
			}

			return a.alcoholContent - b.alcoholContent;
		}

		if (filter.current.sort === 'alcohol-desc') {
			if (a.alcoholContent === null) {
				return 1;
			}

			if (b.alcoholContent === null) {
				return -1;
			}

			return b.alcoholContent - a.alcoholContent;
		}

		if (filter.current.sort === 'volume-asc') {
			if (a.volume === null) {
				return -1;
			}

			if (b.volume === null) {
				return 1;
			}

			return a.volume - b.volume;
		}

		if (filter.current.sort === 'volume-desc') {
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
