export class BanService {
	#kv: KVNamespace;

	constructor(kv: KVNamespace) {
		this.#kv = kv;
	}

	async banIp(ip: string): Promise<void> {
		await this.#kv.put(`banned:${ip}`, 'banned', { expirationTtl: 60 * 60 * 24 * 7 });
	}

	async isIpBanned(ip: string): Promise<boolean> {
		const banned = await this.#kv.get(`banned:${ip}`);
		return banned !== null;
	}
}
