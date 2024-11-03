import { browser } from '$app/environment';

export class WishlistState {
	#whishlist: Array<string> = $state([]);

	constructor() {
		this.#whishlist = this.getFromLocalStorage();
	}

	get products() {
		return this.#whishlist;
	}

	add(id: string) {
		this.#whishlist.push(id);
		this.save();
	}

	remove(id: string) {
		this.#whishlist = this.#whishlist.filter((item) => item !== id);
		this.save();
	}

	save() {
		localStorage.setItem('wishlist', JSON.stringify(this.#whishlist));
	}

	getFromLocalStorage() {
		if (!browser) return [];

		const wishlist = localStorage.getItem('wishlist');
		if (!wishlist) return [];

		return JSON.parse(wishlist) as Array<string>;
	}
}
