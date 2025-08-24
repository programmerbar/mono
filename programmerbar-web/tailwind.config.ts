import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: 'var(--primary)',
					dark: 'var(--primary-dark)',
					light: 'var(--primary-light)'
				},
				secondary: {
					DEFAULT: 'var(--secondary)',
					dark: 'var(--secondary-dark)',
					light: 'var(--secondary-light)'
				},
				foreground: 'var(--foreground)',
				background: 'var(--background)',
				muted: 'var(--muted)',
				border: 'var(--border)'
			},
			fontFamily: {
				sans: ['Ubuntu', ...fontFamily.sans],
				mono: ['IBM Plex Mono', ...fontFamily.mono]
			}
		}
	},
	plugins: [typography, forms]
} satisfies Config;
