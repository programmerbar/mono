import { dev } from '$app/environment';

const FRONTLINE_PROXY = dev ? 'http://localhost:8787' : 'https://frontline.programmer.bar';

export const getStock = async (sku: string | null) => {
	if (!sku) return null;

	try {
		const resp = await fetch(`${FRONTLINE_PROXY}/product/${sku}`);

		if (resp.status === 404) {
			return null;
		}

		const data = (await resp.json()) as { stock: string };
		return Number(data.stock);
	} catch (e) {
		console.error(e);
		return null;
	}
};
