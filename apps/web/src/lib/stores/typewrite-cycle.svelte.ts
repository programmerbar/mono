export const createTypewriteCycle = (words: Array<string>, speed: number = 400) => {
	let currentWordIndex = $state(0);
	let displayedText = $state('');
	let isAdding = $state(true);

	$effect(() => {
		let index = 0;
		const processWord = () => {
			const currentWord = words[currentWordIndex];
			if (isAdding) {
				if (index < currentWord.length) {
					displayedText += currentWord[index];
					index++;
				} else {
					// Switch to removing mode after a short pause
					setTimeout(() => {
						isAdding = false;
					}, speed);
				}
			} else {
				if (displayedText.length > 0) {
					displayedText = displayedText.slice(0, -1);
				} else {
					// Switch to next word and adding mode
					isAdding = true;
					index = 0;
					currentWordIndex = (currentWordIndex + 1) % words.length;
				}
			}
		};

		const interval = setInterval(processWord, 100);

		return () => {
			clearInterval(interval);
		};
	});

	return {
		get text() {
			return displayedText;
		}
	};
};
