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
	#type = $state<string | null>('');
	#hideSoldOut = $state(true);
	#showStudentPrice = $state(true);

	get search() {
		return this.#search;
	}

	get sort() {
		return this.#sort;
	}

	get type() {
		return this.#type;
	}

	get hideSoldOut() {
		return this.#hideSoldOut;
	}

	get showStudentPrice() {
		return this.#showStudentPrice;
	}

	set search(value: string) {
		this.#search = value;
	}

	set sort(value: Sort) {
		this.#sort = value;
	}

	set type(value: string | null) {
		this.#type = value;
	}

	set hideSoldOut(value: boolean) {
		this.#hideSoldOut = value;
	}

	set showStudentPrice(value: boolean) {
		this.#showStudentPrice = value;
	}
}
