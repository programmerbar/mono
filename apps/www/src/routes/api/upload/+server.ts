import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const POST: RequestHandler = async ({ request, locals }) => {
	if (locals.user?.role !== 'board') {
		throw error(403, { message: 'Unauthorized' });
	}

	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const type = formData.get('type') as string;

		if (!file) {
			throw error(400, { message: 'No file provided' });
		}

		if (!ALLOWED_TYPES.includes(file.type)) {
			throw error(400, { message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' });
		}

		if (file.size > MAX_FILE_SIZE) {
			throw error(400, { message: 'File too large. Maximum size is 5MB.' });
		}

		if (!type || !['product', 'producer'].includes(type)) {
			throw error(400, { message: 'Invalid upload type. Must be "product" or "producer".' });
		}

		const imageId = await locals.imageService.upload(file);

		return json({
			success: true,
			imageId
		});
	} catch (err) {
		console.error('Upload error:', err);

		if (err instanceof Response) {
			throw err;
		}

		throw error(500, { message: 'Upload failed' });
	}
};
