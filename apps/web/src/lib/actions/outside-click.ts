import type { Action } from 'svelte/action';

type Callback = () => void;

export const outsideClick: Action<HTMLElement, Callback> = (node, cb) => {
	const handleClick = (event: MouseEvent) => {
		if (node && !node.contains(event.target as Node)) {
			cb();
		}
	};

	document.addEventListener('click', handleClick);

	return {
		destroy() {
			document.removeEventListener('click', handleClick);
		}
	};
};
