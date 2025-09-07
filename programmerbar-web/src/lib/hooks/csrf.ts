import type { Handle } from '@sveltejs/kit';

function isFormContentType(request: Request): boolean {
	const contentType = request.headers.get('content-type');

	if (!contentType) {
		return false;
	}

	return (
		contentType === 'application/x-www-form-urlencoded' ||
		contentType.startsWith('multipart/form-data')
	);
}

export function csrf(allowedPaths: string[], allowedOrigins: string[] = []): Handle {
	return async ({ event, resolve }) => {
		const { request, url } = event;

		// Skip CSRF protection for allowed paths
		if (allowedPaths.includes(url.pathname)) {
			return resolve(event);
		}

		// Apply CSRF protection for form submissions
		const forbidden =
			isFormContentType(request) && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);

		if (forbidden) {
			const origin = request.headers.get('origin');
			const expectedOrigin = `${url.protocol}//${url.host}`;

			// Check if origin is in allowed origins or matches expected origin
			if (origin !== expectedOrigin && !allowedOrigins.includes(origin || '')) {
				return new Response('Forbidden', { status: 403 });
			}
		}

		return resolve(event);
	};
}
