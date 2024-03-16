/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,svelte,js,ts}'],
	theme: {
		extend: {
			colors: {
				primary: 'var(--primary)',
				foreground: 'var(--foreground)',
				background: 'var(--background)'
			}
		}
	},
	plugins: []
};
