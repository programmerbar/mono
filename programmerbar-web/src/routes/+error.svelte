<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/Button.svelte';
	import ButtonLink from '$lib/components/ui/ButtonLink.svelte';
	import {
		AlertCircle,
		Lock,
		ShieldAlert,
		FileQuestion,
		AlertTriangle,
		Wifi
	} from '@lucide/svelte';

	type Icon = typeof AlertCircle;

	const errors: Record<number, { title: string; message: string; icon: Icon }> = {
		400: {
			title: 'Dårlig forespørsel',
			message: 'Vi kunne ikke forstå forespørselen din. Prøv på nytt.',
			icon: AlertCircle
		},
		401: {
			title: 'Uautorisert',
			message: 'Du må være logget inn for å få tilgang til denne siden.',
			icon: Lock
		},
		403: {
			title: 'Forbidden',
			message: 'Du har ikke tillatelse til å få tilgang til denne siden.',
			icon: ShieldAlert
		},
		404: {
			title: 'Siden ble ikke funnet',
			message: 'Beklager, vi kunne ikke finne siden du leter etter.',
			icon: FileQuestion
		},
		500: {
			title: 'Serverfeil',
			message: 'Noe gikk galt på serveren vår. Vennligst prøv igjen senere.',
			icon: AlertTriangle
		},
		503: {
			title: 'Tjenesten er utilgjengelig',
			message: 'Serveren er for tiden utilgjengelig. Vennligst prøv igjen senere.',
			icon: Wifi
		}
	};

	const error = errors[page.status] || {
		title: 'Feil',
		message: 'Noe uventet skjedde. Vennligst prøv igjen.',
		icon: AlertCircle
	};
</script>

<div class="flex min-h-screen flex-col bg-[url('/circuit-board.svg')] bg-size-[400px] px-4">
	<div class="flex flex-1 items-center justify-center">
		<div
			class="bg-opacity-95 w-full max-w-2xl rounded-xl border-2 border-gray-300 bg-white p-8 text-center"
		>
			<div class="mb-4 flex justify-center">
				<svelte:component this={error.icon} class="h-12 w-12 text-gray-600" />
			</div>
			<h1 class="mb-4 font-mono text-5xl font-bold text-gray-700">{page.status}</h1>
			<h2 class="mb-4 text-2xl font-semibold text-gray-800">{error.title}</h2>
			<p class="mb-6 text-gray-600">{error.message}</p>

			{#if page.status === 404}
				<div class="mb-8 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
					<p class="mb-2 text-xs font-medium text-gray-500">Den forespurte URL-en var:</p>
					<p class="font-mono text-sm break-all text-gray-700">{page.url.pathname}</p>
				</div>
			{/if}

			<div class="flex flex-wrap justify-center gap-3">
				<ButtonLink href="/" intent="primary">Til forsiden</ButtonLink>
				<Button intent="outline" onclick={() => window.history.back()}>Gå tilbake</Button>
			</div>
		</div>
	</div>
</div>
