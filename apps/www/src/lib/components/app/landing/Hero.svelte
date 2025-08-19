<script lang="ts">
	import { onMount } from 'svelte';

	let displayText = $state('');
	let showCursor = $state(true);
	let isGlitching = $state(false);
	const fullText = 'programmerbar';
	const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';

	onMount(() => {
		let currentIndex = 0;

		function glitchCharacter(targetChar: string, callback: () => void) {
			isGlitching = true;
			let glitchCount = 0;
			const maxGlitches = 2 + Math.floor(Math.random() * 3); // 2-4 glitches

			const glitchInterval = setInterval(() => {
				if (glitchCount < maxGlitches) {
					const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
					displayText = displayText.slice(0, -1) + randomChar;
					glitchCount++;
				} else {
					displayText = displayText.slice(0, -1) + targetChar;
					isGlitching = false;
					clearInterval(glitchInterval);
					callback();
				}
			}, 30);
		}

		function typeNextCharacter() {
			if (currentIndex < fullText.length) {
				displayText += '_';

				setTimeout(() => {
					glitchCharacter(fullText[currentIndex], () => {
						currentIndex++;
						setTimeout(typeNextCharacter, 80 + Math.random() * 120);
					});
				}, 50);
			}
		}

		setTimeout(typeNextCharacter, 200);

		const cursorInterval = setInterval(() => {
			showCursor = !showCursor;
		}, 500);

		const randomGlitchInterval = setInterval(() => {
			if (currentIndex >= fullText.length && Math.random() < 0.1) {
				const randomPos = Math.floor(Math.random() * fullText.length);
				const originalChar = fullText[randomPos];
				const beforeText = displayText.slice(0, randomPos);
				const afterText = displayText.slice(randomPos + 1);

				const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
				displayText = beforeText + randomChar + afterText;

				setTimeout(() => {
					displayText = beforeText + originalChar + afterText;
				}, 100);
			}
		}, 2000);

		return () => {
			clearInterval(cursorInterval);
			clearInterval(randomGlitchInterval);
		};
	});
</script>

<div class="space-y-10 pb-56 pt-32">
	<h1 class="text-center font-mono text-4xl text-gray-700 sm:text-5xl md:text-6xl lg:text-7xl">
		$ <span class:text-red-500={isGlitching}>{displayText}</span><span
			class="text-gray-500"
			class:opacity-0={!showCursor}>_</span
		>
	</h1>

	<div class="mx-auto w-fit pt-8">
		<a
			href="https://forms.gle/BLdygdoRJgjMbQZj6"
			class="rounded-lg border-2 bg-gray-200 px-6 py-3 text-lg font-medium text-gray-700 shadow transition-colors hover:border-gray-400 hover:bg-gray-300"
			>Klikk her for å booke!</a
		>
	</div>
</div>
