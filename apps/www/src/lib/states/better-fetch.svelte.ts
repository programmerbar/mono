export const f = async <T>(url: string, options: RequestInit = {}) => {
	let state = $state('idle');
	let error = $state<string | null>(null);
	let response = $state<T | null>(null);

	return {
		async fetch() {
			state = 'loading';
			try {
				const res = await fetch(url, options);
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				response = await res.json();
				state = 'success';
			} catch (err) {
				if (err instanceof Error && typeof err.message === 'string') {
					error = err.message;
				} else {
					error = 'An unknown error occurred';
				}
				state = 'error';
			}
		},
		state,
		error,
		response
	};
};
