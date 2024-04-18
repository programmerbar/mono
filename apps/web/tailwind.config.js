import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,svelte,js,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: 'var(--primary)',
					dark: 'var(--primary-dark)',
					light: 'var(--primary-light)'
				},
				secondary: {
					DEFAULT: 'var(--secondary)'
				},
				foreground: 'var(--foreground)',
				background: 'var(--background)'
			},
			fontFamily: {
				sans: ['Ubuntu', ...fontFamily.sans],
				mono: ['IBM Plex Mono', ...fontFamily.mono]
			}
		}
	},
	plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')]
};
