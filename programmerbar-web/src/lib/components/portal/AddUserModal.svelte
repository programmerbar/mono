<script lang="ts">
	import { Dialog, Label, Separator } from 'bits-ui';
	import { X } from '@lucide/svelte';
	import Button from '../ui/Button.svelte';
	import Input from '../ui/Input.svelte';
	import { toast } from 'svelte-sonner';
	import { sendInvitationEmail } from '$lib/api/remotes/invitations.remote';
	import { getThemeContext } from '$lib/states/theme.svelte';

	let open = $state(false);
	let email = $state('');

	const theme = getThemeContext();

	const handleSendInvitation = async () => {
		if (!email) return;

		const success = await sendInvitationEmail(email);

		if (success) {
			email = '';
			toast.info('Invitasjonen ble sendt');
		} else {
			toast.error('Noe gikk galt ved sending av invitasjon');
		}
	};
</script>

<Button onclick={() => (open = true)}>Inviter bruker</Button>

<Dialog.Root bind:open>
	<Dialog.Trigger />
	<Dialog.Portal>
		<div class={theme.isDark ? 'dark' : ''}>
			<Dialog.Overlay class="fixed inset-0 z-50 bg-black/60 dark:bg-black/80" />
			<Dialog.Content
				class="bg-background fixed top-[50%] left-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-lg border p-5 outline-none sm:max-w-[490px] md:w-full dark:border-slate-700 dark:bg-slate-800"
			>
				<Dialog.Title
					class="flex w-full items-center justify-center text-lg font-medium dark:text-gray-100"
					>Send invitasjon</Dialog.Title
				>
				<Separator.Root class="bg-muted -mx-5 mt-5 mb-6 block h-px dark:bg-slate-600" />
				<Dialog.Description class="text-sm dark:text-gray-300">
					Send en invitasjon til brukeren for å gi tilgang til portalen. Du kan bare invitere
					brukere med feide-konto. E-posten skal være i formatet: navn@student.uib.no. Du kan se det
					på profil-siden på
					<a class="underline hover:no-underline dark:text-blue-400" href="https://echo.uib.no"
						>echo.uib.no</a
					>.
				</Dialog.Description>

				<div class="flex flex-col items-start gap-1 pt-7 pb-11">
					<Label.Root for="apiKey" class="text-sm font-medium dark:text-gray-200">E-post</Label.Root
					>
					<div class="relative w-full">
						<Input
							placeholder="prog.bar@student.uib.no"
							class="w-full"
							type="email"
							bind:value={email}
						/>
					</div>
				</div>
				<div class="flex w-full justify-end">
					<Dialog.Close>
						<Button onclick={handleSendInvitation}>Send invitasjon</Button>
					</Dialog.Close>
				</div>
				<Dialog.Close
					class="focus-visible:ring-foreground focus-visible:ring-offset-background absolute top-5 right-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-98 dark:text-gray-300"
				>
					<div>
						<X class="text-foreground size-5 dark:text-gray-300" />
						<span class="sr-only">Close</span>
					</div>
				</Dialog.Close>
			</Dialog.Content>
		</div>
	</Dialog.Portal>
</Dialog.Root>
