<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';

	const groupLogo = '/android-chrome-192x192.png';
	const groupName = 'Programmerbar';
	const estYear = '2020';
	const description = 'Tidligere og nåværende medlemmer av echo Programmerbar';

	const coFounders = [
		{ name: 'Brigt A.T Håvardstun', role: 'Co-founder' },
		{ name: 'Sandra Lekve', role: 'Co-founder' },
		{ name: 'Vegard Jensløkken', role: 'Co-founder' },
		{ name: 'Eivind D. Halderaker', role: 'Co-founder' }
	];

	const members = [
		'Erik Fjelltveit Nyhuus',
		'Lene Soltveit',
		'Steffen Andre Pettersen',
		'Siren Bjorøy',
		'Ole Straumland',
		'Tony Lam',
		'Eirik Rekve Thorsheim',
		'Ole Magnus Fon Johnsen',
		'August Ebne Røeggen',
		'Fredrik Hast Sørli',
		'Sturla Rognskog Mella',
		'Tord Vikøren Vikestad',
		'Henrik Sætre Breivik'
	];

	const pastMembers = [
		'Mina Tolfsen',
		'Ask Rud Persson',
		'Palma Rud Persson',
		'Sigurd Johnsen Setså',
		'Erlend Raa Vågset',
		'Sofia Hestenes Eika',
		'Kristoffer Borg Nilsen',
		'Lars Lismoen',
		'Yoeri Otten',
		'Eirik Øygard',
		'Arne Natskår',
		'Alexander Alf Iversen',
		'Henrik Trondseth',
		'Emil Johannessen',
		'Andre Normann',
		'Sofie Nhu Nguyen',
		'Simen Hauge Østbø',
		'Stian Munkejord',
		'Gard Heine Kalland',
		'Lars Bysheim',
		'Lars Haukland'
	];
</script>

<SEO
	title="Tidligere Styremedlemmer"
	description="Lær mer om tidligere og nåværende styremedlemmer i Programmerbar."
	keywords="styremedlemmer, tidligere styremedlemmer, programmerbar, studentbar, teknologistudenter"
	canonical="/emeritus"
	type="website"
/>

<div class="container py-10 text-center">
	<img class="mx-auto h-32 w-auto" src={groupLogo} alt="Programmerbar logo" />
	<h1 class="font-display mx-auto">{groupName}</h1>
	<p class="text-muted-foreground text-xs">EST. {estYear}</p>
	<p class="text-muted-foreground">{description}</p>

	<div class="mx-auto my-10 max-w-md space-y-8">
		<!-- Co-founders -->
		<ul class="list-none p-0 text-lg">
			{#each coFounders as founder (founder.name)}
				<li class="relative mx-auto w-fit">
					<!-- Inline crown icon -->
					<svg
						class="absolute top-1 -left-6 h-4 w-4 text-yellow-400"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							d="M2.5 8a.5.5 0 0 1 .5-.5H5v-3H3a.5.5 0 0 1-.5-.5H1v9h1.5a.5.5 0 0 1 .5-.5H5v-3H3.5a.5.5 0 0 1-.5-.5zM11 8a.5.5 0 0 0-.5-.5H9v-3h2a.5.5 0 0 0 .5-.5H15v9h-1.5a.5.5 0 0 0-.5-.5H11v-3zM6 8.5a.5.5 0 0 0 .5-.5V5.5H8v2.5a.5.5 0 0 0 .5.5H10v3H6v-3h.001z"
						/>
					</svg>
					<span>{founder.name} ({founder.role})</span>
				</li>
			{/each}
		</ul>

		<!-- Members -->
		<h2 class="text-xl font-bold">Styremedlemmer</h2>
		<ul class="list-none p-0 text-lg">
			{#each members as member (member)}
				<li>{member}</li>
			{/each}
		</ul>

		<!-- Past Members -->
		<h2 class="mt-16 text-xl font-bold">Tidligere Styremedlemmer</h2>
		<ul class="list-none p-0 text-lg">
			{#each pastMembers as member (member)}
				<li>{member}</li>
			{/each}
		</ul>
	</div>
</div>
