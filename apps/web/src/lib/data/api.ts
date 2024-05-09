export const getStatus = async () => {
	return (await fetch('https://api.programmer.bar').then((res) => res.json())) as {
		status: number;
		message: string;
	};
};

export const mutateStatus = async (status: 0 | 1 | 2) => {
	return await fetch('https://api.programmer.bar', {
		method: 'POST',
		body: JSON.stringify({ status })
	});
};

export const getProfilePicture = async (id: string) => {
	const response = await fetch(`/profile-pic/${id}`);

	if (response.ok) {
		const blob = await response.blob();
		return URL.createObjectURL(blob);
	}

	return null;
};
