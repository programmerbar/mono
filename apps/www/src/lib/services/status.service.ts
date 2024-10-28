export const STATUS_KEY = 'status';

export const STATUS = {
	CLOSED: 0,
	OPEN: 1,
	PRIVATE: 2
} as const;

export const getStatusMessage = (status: number) => {
	switch (status) {
		case STATUS.CLOSED:
			return 'Baren er nå stengt! 🚪';
		case STATUS.OPEN:
			return 'Baren er nå åpen! 🍻';
		case STATUS.PRIVATE:
			return 'Lukket arrangement. 🎉';
		default:
			return 'Ukjent status.';
	}
};

export class StatusService {
	#kv: KVNamespace;

	constructor(kv: KVNamespace) {
		this.#kv = kv;
	}

	async get() {
		return Number(await this.#kv.get(STATUS_KEY));
	}

	async set(status: number) {
		await this.#kv.put(STATUS_KEY, String(status));
	}
}
