export const getStatus = async () => {
	return (await fetch('https://is-open.omfj.workers.dev/').then((res) => res.json())) as {
		status: number;
		message: string;
	};
};
