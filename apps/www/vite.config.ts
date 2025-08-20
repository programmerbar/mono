import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit(), tailwindcss()],
	resolve: {
		alias: {
			'react-dom/server': 'react-dom/server.edge'
		}
	}
}));
