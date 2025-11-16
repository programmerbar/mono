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

<div class="space-y-6 pt-12 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24">
	<h1
		class="text-foreground-secondary text-center font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
	>
		$ <span class:text-accent-error={isGlitching}>{displayText}</span><span
			class="text-foreground-muted"
			class:opacity-0={!showCursor}>_</span
		>
	</h1>

	<p class="text-foreground-muted mx-auto max-w-2xl text-center text-sm md:text-base">
		En studentbar for informatikkstudenter på Universitet i Bergen.
	</p>

	<div class="mx-auto flex w-fit flex-col gap-4 pt-8 sm:flex-row sm:gap-6">
		<a
			href="https://forms.gle/BLdygdoRJgjMbQZj6"
			target="_blank"
			rel="noopener noreferrer"
			class="text-foreground-secondary hover:text-primary text-center font-mono text-base transition-colors duration-200"
			><span class="text-foreground-muted">$</span> goto booking</a
		>
		<a
			href={resolve('/meny')}
			class="text-foreground-secondary hover:text-primary text-center font-mono text-base transition-colors duration-200"
			><span class="text-foreground-muted">$</span> goto meny</a
		>
	</div>
</div>
