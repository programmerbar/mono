import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import mkcert from 'vite-plugin-mkcert';
import { sentrySvelteKit } from '@sentry/sveltekit';

export default defineConfig(() => ({
	plugins: [
		sveltekit(),
		tailwindcss(),
		mkcert(),
		devtoolsJson(),
		sentrySvelteKit({
			org: 'programmerbar',
			project: 'programmerbar-web',
			authToken: process.env.SENTRY_AUTH_TOKEN
		})
	],
	resolve: {
		alias: { 'react-dom/server': 'react-dom/server.edge' }
	}
}));
