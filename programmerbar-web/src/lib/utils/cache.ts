export class Cache<T> {
	#cache = new Map<string, { data: T; timestamp: number }>();
	#timeout: number;

	constructor(timeoutMs: number = 5 * 60 * 1000) {
		this.#timeout = timeoutMs;
	}

	get(key: string): T | undefined {
		const cached = this.#cache.get(key);
		if (cached && Date.now() - cached.timestamp < this.#timeout) {
			return cached.data;
		}
		this.#cache.delete(key);
		return undefined;
	}

	set(key: string, data: T): void {
		this.#cache.set(key, { data, timestamp: Date.now() });
	}

	clear(): void {
		this.#cache.clear();
	}
}
