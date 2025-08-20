import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.role !== 'board') {
		throw redirect(302, '/portal');
	}

	const [producers, productTypes] = await Promise.all([
		locals.producerService.getAll(),
		locals.productTypeService.getAll()
	]);

	return {
		producers,
		productTypes,
		productId: nanoid()
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (locals.user?.role !== 'board') {
			return fail(403, { message: 'Unauthorized' });
		}

		const data = await request.formData();
		const id = data.get('id') as string;
		const name = data.get('name') as string;
		const description = data.get('description') as string;
		const sku = data.get('sku') as string;
		const ordinaryPrice = parseFloat(data.get('ordinaryPrice') as string);
		const studentPrice = parseFloat(data.get('studentPrice') as string);
		const internalPrice = parseFloat(data.get('internalPrice') as string);
		const credits = data.get('credits') ? parseInt(data.get('credits') as string) : null;
		const volume = data.get('volume') ? parseFloat(data.get('volume') as string) : null;
		const alcoholContent = data.get('alcoholContent')
			? parseFloat(data.get('alcoholContent') as string)
			: null;
		const producerId = (data.get('producerId') as string) || null;
		const productTypeIds = data.getAll('productTypeIds') as string[];
		const variants = data.get('variants') as string;
		const imageId = data.get('imageId') as string;
		const isSoldOut = data.get('isSoldOut') === 'true';

		if (!id?.trim()) {
			return fail(400, { message: 'ID er påkrevd' });
		}

		if (!name?.trim()) {
			return fail(400, { message: 'Navn er påkrevd' });
		}

		if (isNaN(ordinaryPrice) || isNaN(studentPrice) || isNaN(internalPrice)) {
			return fail(400, { message: 'Alle priser må være gyldige tall' });
		}

		if (ordinaryPrice < 0 || studentPrice < 0 || internalPrice < 0) {
			return fail(400, { message: 'Priser kan ikke være negative' });
		}

		if (credits !== null && (credits < 1 || credits > 5)) {
			return fail(400, { message: 'Credits må være mellom 1 og 5' });
		}

		try {
			const variantsArray = variants?.trim()
				? variants
						.split(',')
						.map((v) => v.trim())
						.filter((v) => v.length > 0)
				: null;

			await locals.productService.create(
				{
					id: id.trim(),
					name: name.trim(),
					description: description?.trim() || null,
					sku: sku?.trim() || null,
					ordinaryPrice,
					studentPrice,
					internalPrice,
					credits,
					volume,
					alcoholContent,
					variants: variantsArray,
					imageId: imageId?.trim() || null,
					producerId,
					isSoldOut
				},
				productTypeIds
			);

			throw redirect(302, '/portal/admin/cms/products');
		} catch (error) {
			if (error instanceof Error && error.message.includes('redirect')) {
				throw error;
			}
			console.error('Error creating product:', error);
			return fail(500, { message: 'Kunne ikke opprette produkt' });
		}
	}
};
