import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';

type Theme = 'light' | 'dark';

class AppThemeState {
	#theme = $state<Theme>('light');

	constructor() {
		if (browser) {
			// Load theme from localStorage on mount
			const stored = localStorage.getItem('app-theme') as Theme | null;
			if (stored === 'dark' || stored === 'light') {
				this.#theme = stored;
			} else {
				// Check system preference
				const prefersDark =
					window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
				this.#theme = prefersDark ? 'dark' : 'light';
			}
		}

		// Save to localStorage and update document class when theme changes
		$effect(() => {
			if (!browser) return;
			localStorage.setItem('app-theme', this.#theme);

			// Update document class for dark mode
			if (this.#theme === 'dark') {
				document.documentElement.classList.add('dark');
				document.body.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
				document.body.classList.remove('dark');
			}
		});
	}

	get current(): Theme {
		return this.#theme;
	}

	get isDark(): boolean {
		return this.#theme === 'dark';
	}

	toggle() {
		this.#disableTransitions();
		this.#theme = this.#theme === 'light' ? 'dark' : 'light';
	}

	set(theme: Theme) {
		this.#disableTransitions();
		this.#theme = theme;
	}

	// Disable transitions during theme change
	#disableTransitions() {
		if (!browser) return;
		const doc = document.documentElement;
		doc.classList.add('disable-transitions');
		setTimeout(() => {
			doc.classList.remove('disable-transitions');
		}, 0);
	}
}

const THEME_KEY = Symbol('app-theme');

export function createAppThemeContext() {
	const theme = new AppThemeState();
	setContext(THEME_KEY, theme);
	return theme;
}

export function getAppThemeContext() {
	return getContext<AppThemeState>(THEME_KEY);
}
