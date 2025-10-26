import { building } from '$app/environment';
import type { RequestEvent } from '@sveltejs/kit';

export class BanService {
	#kv: KVNamespace;

	constructor(kv: KVNamespace) {
		this.#kv = kv;
	}

	async getIp(event: RequestEvent): Promise<string | null> {
		try {
			return event.getClientAddress();
		} catch {
			console.warn('Could not get client IP address. Assuming localhost and continuing.');
			return null;
		}
	}

	async ban(event: RequestEvent): Promise<void> {
		const ip = await this.getIp(event);
		await this.#kv.put(`banned:${ip}`, 'banned', { expirationTtl: 60 * 60 * 24 * 7 });
	}

	async isBanned(event: RequestEvent): Promise<boolean> {
		if (building) return false;

		const ip = await this.getIp(event);
		const banned = await this.#kv.get(`banned:${ip}`);
		return banned !== null;
	}
}
