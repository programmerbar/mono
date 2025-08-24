export function GET() {
	return new Response(null, {
		status: 301,
		headers: {
			Location: 'https://forms.gle/BLdygdoRJgjMbQZj6'
		}
	});
}
