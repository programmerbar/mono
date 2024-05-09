import Avatar from '$lib/assets/avatar.png?url';

export const GET = async ({ platform, params, fetch }) => {
	const id = params.id;

	const avatarPath = `avatars/${id}`;
	const avatar = await platform?.env.R2.get(avatarPath);

	if (!avatar) {
		const arrayBuffer = await fetch(Avatar).then((res) => res.arrayBuffer());
		return new Response(arrayBuffer, {
			status: 200,
			headers: {
				'Content-Type': 'image/png'
			}
		});
	}

	const headers = new Headers(Object.entries(avatar?.httpMetadata ?? {}));
	headers.set('etag', avatar?.etag ?? '');

	return new Response(avatar?.body, { headers });
};
