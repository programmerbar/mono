import { SvelteSet } from 'svelte/reactivity';

export const SORT_OPTIONS = [
	{ value: 'name-asc', label: 'Navn (A-Å)' },
	{ value: 'name-desc', label: 'Navn (Å-A)' },
	{ value: 'price-asc', label: 'Pris (Lav-Høy)' },
	{ value: 'price-desc', label: 'Pris (Høy-Lav)' },
	{ value: 'alcohol-asc', label: 'Alkohol (Lav-Høy)' },
	{ value: 'alcohol-desc', label: 'Alkohol (Høy-Lav)' },
	{ value: 'volume-asc', label: 'Volum (Lav-Høy)' },
	{ value: 'volume-desc', label: 'Volum (Høy-Lav)' }
];

export type Sort = (typeof SORT_OPTIONS)[number]['value'];

type FilterStateType = {
	search: string;
	sort: Sort;
	types: SvelteSet<string>;
	breweries: SvelteSet<string>;
	priceRange: {
		min: number;
		max: number;
	};
	hideSoldOut: boolean;
	showStudentPrice: boolean;
	showCreditPrice: boolean;
};

function getDefaultState(): FilterStateType {
	return {
		search: '',
		sort: 'name-asc',
		types: new SvelteSet(),
		breweries: new SvelteSet(),
		priceRange: { min: 0, max: 1000 },
		hideSoldOut: true,
		showStudentPrice: true,
		showCreditPrice: false
	};
}

export class FilterState {
	current = $state(getDefaultState());

	toggleType(value: string) {
		if (this.current.types.has(value)) {
			this.current.types.delete(value);
		} else {
			this.current.types.add(value);
		}
	}

	toggleBrewery(value: string) {
		if (this.current.breweries.has(value)) {
			this.current.breweries.delete(value);
		} else {
			this.current.breweries.add(value);
		}
	}

	reset(priceRange?: { min: number; max: number }) {
		// Reset properties individually to maintain reactivity
		this.current.search = '';
		this.current.sort = 'name-asc';
		this.current.types.clear();
		this.current.breweries.clear();
		this.current.hideSoldOut = true;
		this.current.showStudentPrice = true;
		this.current.showCreditPrice = false;

		// Reset price range - use provided range or default
		if (priceRange) {
			this.current.priceRange = { min: priceRange.min, max: priceRange.max };
		} else {
			this.current.priceRange = { min: 0, max: 1000 };
		}
	}

	initializePriceRange(minPrice: number, maxPrice: number) {
		this.current.priceRange = { min: minPrice, max: maxPrice };
	}
}
