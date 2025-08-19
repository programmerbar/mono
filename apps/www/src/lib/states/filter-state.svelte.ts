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

export class FilterState {
	#search = $state('');
	#sort = $state<Sort>('name-asc');
	#types = $state<SvelteSet<string>>(new SvelteSet<string>());
	#breweries = $state<SvelteSet<string>>(new SvelteSet<string>());
	#priceRange = $state<{ min: number; max: number }>({ min: 0, max: 1000 });
	#originalPriceRange = { min: 0, max: 1000 };
	#hideSoldOut = $state(true);
	#showStudentPrice = $state(true);
	#showCreditPrice = $state(false);

	get search() {
		return this.#search;
	}

	get sort() {
		return this.#sort;
	}

	get types() {
		return this.#types;
	}

	get breweries() {
		return this.#breweries;
	}

	get priceRange() {
		return this.#priceRange;
	}

	get hideSoldOut() {
		return this.#hideSoldOut;
	}

	get showStudentPrice() {
		return this.#showStudentPrice;
	}

	get showCreditPrice() {
		return this.#showCreditPrice;
	}

	set search(value: string) {
		this.#search = value;
	}

	set sort(value: Sort) {
		this.#sort = value;
	}

	set types(value: SvelteSet<string>) {
		this.#types = value;
	}

	set breweries(value: SvelteSet<string>) {
		this.#breweries = value;
	}

	set priceRange(value: { min: number; max: number }) {
		this.#priceRange = value;
	}

	set hideSoldOut(value: boolean) {
		this.#hideSoldOut = value;
	}

	set showStudentPrice(value: boolean) {
		this.#showStudentPrice = value;
	}
	set showCreditPrice(value: boolean) {
		this.#showCreditPrice = value;
	}

	reset() {
		this.#search = '';
		this.#sort = 'name-asc';
		this.#types = new SvelteSet<string>();
		this.#breweries = new SvelteSet<string>();
		this.#priceRange = { min: this.#originalPriceRange.min, max: this.#originalPriceRange.max };
		this.#hideSoldOut = true;
		this.#showStudentPrice = true;
		this.#showCreditPrice = false;
	}

	initializePriceRange(minPrice: number, maxPrice: number) {
		this.#originalPriceRange = { min: minPrice, max: maxPrice };
		this.#priceRange = { min: minPrice, max: maxPrice };
	}
}
