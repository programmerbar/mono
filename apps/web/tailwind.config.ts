import { type Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

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
	plugins: []
} satisfies Config;
