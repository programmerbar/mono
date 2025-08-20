import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals, setHeaders }) => {
	const { id } = params;

	if (!id) {
		throw error(400, { message: 'Image ID is required' });
	}

	const object = await locals.imageService.get(id);

	if (!object) {
		throw error(404, { message: 'Image not found' });
	}

	const imageBuffer = await object.arrayBuffer();
	const contentType = object.httpMetadata?.contentType || 'image/jpeg';

	setHeaders({
		'Content-Type': contentType,
		'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
		ETag: object.etag || '',
		'Last-Modified': object.uploaded?.toUTCString() || new Date().toUTCString(),
		'Content-Length': imageBuffer.byteLength.toString()
	});

	return new Response(imageBuffer, {
		status: 200,
		headers: {
			'Content-Type': contentType,
			'Cache-Control': 'public, max-age=31536000, immutable',
			ETag: object.etag || '',
			'Last-Modified': object.uploaded?.toUTCString() || new Date().toUTCString()
		}
	});
};
