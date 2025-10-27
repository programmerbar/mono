import { browser } from '$app/environment';
import { page } from '$app/state';
import { getContext, setContext } from 'svelte';

type Theme = 'light' | 'dark';

class ThemeState {
	#theme = $state<Theme>('light');

	constructor() {
		$effect(() => {
			if (!browser) return;
			// Load theme from localStorage on mount
			const stored = localStorage.getItem('portal-theme') as Theme | null;
			if (stored === 'dark' || stored === 'light') {
				this.#theme = stored;
			}
		});

		// Save to localStorage and update document class when theme changes
		$effect(() => {
			if (!browser) return;
			localStorage.setItem('portal-theme', this.#theme);

			const portalLayout = document.getElementById('portal-layout');

			// Update document class for dark mode
			if (this.#theme === 'dark') {
				portalLayout?.classList.add('dark');
			} else {
				portalLayout?.classList.remove('dark');
			}
		});
	}

	get current(): Theme {
		return page.url.pathname.startsWith('/portal') ? this.#theme : 'light';
	}

	get isDark(): boolean {
		return this.current === 'dark';
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
		const portalLayout = document.getElementById('portal-layout');
		if (!portalLayout) return;

		portalLayout.classList.add('disable-transitions');

		setTimeout(() => {
			portalLayout.classList.remove('disable-transitions');
		}, 0);
	}
}

const THEME_KEY = Symbol('theme');

export function createThemeContext() {
	return setContext(THEME_KEY, new ThemeState());
}

export function getThemeContext() {
	return getContext<ReturnType<typeof createThemeContext>>(THEME_KEY);
}
