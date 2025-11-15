<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

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

<div class="space-y-10 pt-24 pb-32 md:pt-32 md:pb-40 lg:pt-40 lg:pb-56">
	<h1 class="text-center font-mono text-4xl text-gray-700 sm:text-5xl md:text-6xl lg:text-7xl">
		$ <span class:text-red-500={isGlitching}>{displayText}</span><span
			class="text-gray-500"
			class:opacity-0={!showCursor}>_</span
		>
	</h1>

	<p class="mx-auto max-w-2xl text-center text-lg text-gray-600 md:text-xl">
		En studentbar for informatikkstudenter på Universitet i Bergen.
	</p>

	<div class="mx-auto flex w-fit flex-col gap-6 pt-8 sm:flex-row sm:gap-8">
		<a
			href="https://forms.gle/BLdygdoRJgjMbQZj6"
			target="_blank"
			rel="noopener noreferrer"
			class="text-center font-mono text-lg font-medium text-gray-700 underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-gray-900"
			>Book Bar</a
		>
		<a
			href={resolve('/meny')}
			class="text-center font-mono text-lg font-medium text-gray-700 underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-gray-900"
			>Se Menyen</a
		>
	</div>
</div>
