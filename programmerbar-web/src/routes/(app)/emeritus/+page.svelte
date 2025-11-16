<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import CLIWindow from '$lib/components/app/CLIWindow.svelte';

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
	keywords="styremedlemmer, tidligere styremedlemmer, programmerbar, studentbar, informatikk studenter"
	canonical="/emeritus"
	type="website"
/>

<CLIWindow title="cat emeritus.txt" class="mx-auto max-w-xl">
	<!-- Window Content -->
	<div class="p-6 md:p-8">
		<div class="mx-auto max-w-xl space-y-8 text-center">
			<div>
				<img class="mx-auto h-32 w-auto" src={groupLogo} alt="Programmerbar logo" />
				<h1 class="text-foreground-primary mt-4 text-2xl font-semibold md:text-3xl">{groupName}</h1>
				<p class="text-foreground-muted mt-1 text-xs">
					<span class="text-foreground-subtle">#</span> EST. {estYear}
				</p>
				<p class="text-foreground-secondary mt-2 text-sm">{description}</p>
			</div>

			<div class="space-y-8 text-left">
				<!-- Co-founders -->
				<div>
					<h2 class="text-foreground-primary mb-4 text-lg font-semibold">
						<span class="text-foreground-muted">##</span> Co-founders
					</h2>
					<ul class="space-y-2">
						{#each coFounders as founder (founder.name)}
							<li class="border-primary border-l-4 pl-4">
								{founder.name}
								<span class="text-foreground-muted">({founder.role})</span>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Members -->
				<div>
					<h2 class="text-foreground-primary mb-4 text-lg font-semibold">
						<span class="text-foreground-muted">##</span> Styremedlemmer
					</h2>
					<ul class="space-y-2">
						{#each members as member (member)}
							<li class="border-primary border-l-4 pl-4">
								{member}
							</li>
						{/each}
					</ul>
				</div>

				<!-- Past Members -->
				<div>
					<h2 class="text-foreground-primary mt-12 mb-4 text-lg font-semibold">
						<span class="text-foreground-muted">##</span> Tidligere Styremedlemmer
					</h2>
					<ul class="space-y-2">
						{#each pastMembers as member (member)}
							<li class="border-primary border-l-4 pl-4">
								{member}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
</CLIWindow>
