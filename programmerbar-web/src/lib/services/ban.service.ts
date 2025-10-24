import { building } from '$app/environment';
import type { RequestEvent } from '@sveltejs/kit';

export class BanService {
	#kv: KVNamespace;

	constructor(kv: KVNamespace) {
		this.#kv = kv;
	}

	async ban(event: RequestEvent): Promise<void> {
		const ip = event.getClientAddress();
		await this.#kv.put(`banned:${ip}`, 'banned', { expirationTtl: 60 * 60 * 24 * 7 });
	}

	async isBanned(event: RequestEvent): Promise<boolean> {
		if (building) return false;

		const ip = event.getClientAddress();
		const banned = await this.#kv.get(`banned:${ip}`);
		return banned !== null;
	}
}
