import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command, mode }) => ({
	plugins: [sveltekit(), tailwindcss()],
	resolve: {
		alias:
			mode === 'production'
				? {
						'react-dom/server': 'react-dom/server.edge'
					}
				: undefined
	}
}));
