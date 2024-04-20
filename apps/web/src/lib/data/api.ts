export const getStatus = async () => {
	return (await fetch('https://api.programmer.bar').then((res) => res.json())) as {
		status: number;
		message: string;
	};
};
