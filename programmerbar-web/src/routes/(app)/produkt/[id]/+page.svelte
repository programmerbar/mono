<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { urlFor } from '$lib/api/sanity/queries';
	import { cn } from '$lib/cn';
	import ProductDetailsCard from '$lib/components/app/product/ProductDetailsCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { Image } from '@lucide/svelte';
	import { marked } from 'marked';
	import { toast } from 'svelte-sonner';
	import { onDestroy } from 'svelte';
	import ClaimConfirmationModal from './_components/ClaimConfirmationModal.svelte';
	import ClaimVerificationScreen from './_components/ClaimVerificationScreen.svelte';

	let { data } = $props();

	const html = marked(data.product.description ?? '');
	const isAuthenticated = $derived(page.data.user);
	const canClaimProduct = $derived.by(
		() => isAuthenticated && data.product.priceList.credits && data.product.priceList.credits > 0
	);

	const variants = data.product.variants?.map((variant) => variant) ?? [];

	const metadata = [
		{ title: 'Produsent', value: data.product.producer ?? 'Ingen' },
		{
			title: 'Alkoholinnhold',
			value: data.product.alcoholContent ? `${data.product.alcoholContent}%` : 'Ukjent'
		},
		{ title: 'Volum', value: data.product.volume ? `${data.product.volume} l` : 'Ukjent' },
		{
			title: 'Pris (Ordinær)',
			value:
				data.product.priceList.ordinary === 0 ? 'Gratis' : data.product.priceList.ordinary + ' NOK'
		},
		{
			title: 'Pris (Student)',
			value:
				data.product.priceList.student === 0 ? 'Gratis' : data.product.priceList.student + ' NOK'
		},
		...(data.product.priceList.credits && data.product.priceList.credits > 0
			? [{ title: 'Bong pris', value: data.product.priceList.credits }]
			: [])
	];

	type ClaimFeedback = {
		type: 'success' | 'error';
		message: string;
	};

	const creditCost = data.product.priceList.credits ?? 0;

	let claimLoading = $state(false);
	let claimFeedback = $state<ClaimFeedback | null>(null);
	let showConfirmation = $state(false);
	let showVerification = $state(false);
	let timerSeconds = $state(30);
	let timerInterval = $state<ReturnType<typeof setInterval> | null>(null);
	let remainingCredits = $state<number | null>(null);
	let claimForm = $state<HTMLFormElement | null>(null);
	let imageLoaded = $state(false);

	// SEO data
	const productImage = data.product.image ? urlFor(data.product.image).width(800).url() : undefined;
	const productDescription =
		data.product.description ||
		`${data.product.name} - ${data.product.producer || 'Ukjent produsent'} - Pris fra ${data.product.priceList.student} kr`;

	function openConfirmation() {
		claimFeedback = null;
		remainingCredits = null;
		showConfirmation = true;
	}

	function cancelConfirmation() {
		showConfirmation = false;
	}

	function submitClaimFromModal() {
		if (!claimForm) return;
		claimLoading = true;
		showConfirmation = false;
		claimForm.requestSubmit();
	}

	function startVerificationTimer() {
		timerSeconds = 30;
		if (timerInterval) {
			clearInterval(timerInterval);
		}
		timerInterval = setInterval(() => {
			timerSeconds -= 1;
			if (timerSeconds <= 0 && timerInterval) {
				clearInterval(timerInterval);
				timerInterval = null;
			}
		}, 1000);
	}

	function closeVerification() {
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
		showVerification = false;
		timerSeconds = 30;
	}

	onDestroy(() => {
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	});
</script>

<SEO
	title={data.product.name}
	description={productDescription}
	keywords={`${data.product.name}, ${data.product.producer || ''}, øl, drikke, studentpris, programmerbar`}
	canonical={`/produkt/${data.product._id}`}
	image={productImage}
	type="product"
/>

<div class="mx-auto max-w-6xl">
	<!-- Mobile Header - Only visible on mobile -->
	<div class="mb-6 lg:hidden">
		<h1 class="text-3xl font-bold text-gray-900">{data.product.name}</h1>
		{#if variants.length > 0}
			<p class="mt-2 text-lg text-gray-600">
				{variants.join(' • ')}
			</p>
		{/if}
	</div>

	<div class="grid gap-8 lg:grid-cols-2">
		<!-- Left Column: Image and Description -->
		<div class="space-y-6">
			<!-- Product Image with Description -->
			{#if data.product.image}
				<div class="bg-background overflow-hidden rounded-2xl border shadow-lg">
					<div class="relative flex aspect-square items-center justify-center bg-white">
						<!-- Placeholder Icon -->
						{#if !imageLoaded}
							<div class="absolute inset-0 flex items-center justify-center">
								<Image class="h-16 w-16 text-gray-400" />
							</div>
						{/if}

						<!-- Product Image -->
						<img
							class="max-h-full max-w-full object-contain {imageLoaded
								? 'opacity-100'
								: 'opacity-0'} transition-opacity duration-300"
							src={urlFor(data.product.image).width(400).url()}
							alt={data.product.name}
							onload={() => (imageLoaded = true)}
						/>
					</div>

					<!-- Description attached to image -->
					{#if html}
						<div class="border-t bg-white p-6">
							<div class="prose prose-gray max-w-none">{@html html}</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Right Column: Product Details -->
		<div class="space-y-6">
			<!-- Desktop Header - Only visible on desktop -->
			<div class="hidden space-y-2 lg:block">
				<h1 class="text-4xl font-bold text-gray-900">{data.product.name}</h1>
				{#if variants.length > 0}
					<p class="text-lg text-gray-600">
						{variants.join(' • ')}
					</p>
				{/if}
			</div>

			<!-- Pricing -->
			<div
				class="space-y-4 rounded-xl border border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50 p-6"
			>
				<div
					class={cn('grid grid-cols-1 gap-4', {
						'sm:grid-cols-3': canClaimProduct,
						'sm:grid-cols-2': !canClaimProduct
					})}
				>
					<div class="text-center">
						<p class="text-sm font-medium text-gray-600">Ordinær pris</p>
						<p class="text-2xl font-bold text-gray-900">
							{data.product.priceList.ordinary === 0
								? 'Gratis'
								: `${data.product.priceList.ordinary} kr`}
						</p>
					</div>
					<div class="text-center">
						<p class="text-sm font-medium text-gray-600">Student pris</p>
						<p class="text-2xl font-bold text-blue-600">
							{data.product.priceList.student === 0
								? 'Gratis'
								: `${data.product.priceList.student} kr`}
						</p>
					</div>
					{#if canClaimProduct}
						<div class="text-center">
							<p class="text-sm font-medium text-gray-600">Bong pris</p>
							<p class="text-2xl font-bold text-indigo-600">
								{#if data.product.priceList.credits === 0}
									Gratis
								{:else}
									{data.product.priceList.credits}
									{data.product.priceList.credits === 1 ? 'bong' : 'bonger'}
								{/if}
							</p>
						</div>
					{/if}
				</div>

				{#if canClaimProduct}
					<form
						bind:this={claimForm}
						method="post"
						action="?/claimProduct"
						use:enhance={() => {
							claimLoading = true;
							claimFeedback = null;

							return async ({ result }) => {
								claimLoading = false;

								const fallbackMessage = 'Det oppstod ein feil';
								const extractMessage = (payload: unknown) =>
									typeof payload === 'object' && payload && 'message' in payload
										? String((payload as { message?: unknown }).message ?? fallbackMessage)
										: fallbackMessage;

								if (result.type === 'success' && result.data) {
									const payload = result.data as {
										success?: boolean;
										message?: string;
										updatedBeerCount?: number;
									};

									if (payload.success) {
										const remaining =
											typeof payload.updatedBeerCount === 'number'
												? payload.updatedBeerCount
												: undefined;

										const baseMessage =
											payload.message ??
											`Produkt claimet for ${creditCost} ${creditCost === 1 ? 'bong' : 'bonger'}.`;

										const remainingMessage =
											remaining !== undefined
												? ` Du har ${remaining} ${remaining === 1 ? 'bong' : 'bonger'} igjen.`
												: '';

										toast.success(
											`${data.product.name} claimed!${remainingMessage ? ' ' + remainingMessage : ''}`
										);

										remainingCredits = remaining ?? null;
										showVerification = true;
										startVerificationTimer();

										claimFeedback = {
											type: 'success',
											message: `${baseMessage}${remainingMessage}`
										};

										return;
									}
								}

								const message =
									result.type === 'failure' ? extractMessage(result.data) : fallbackMessage;

								toast.error(message);
								claimFeedback = {
									type: 'error',
									message
								};
							};
						}}
						class="flex flex-col gap-3 rounded-lg bg-white/60 p-4 sm:flex-row sm:items-center sm:justify-between"
					>
						<input type="hidden" name="productId" value={data.product._id} />
						<input type="hidden" name="productName" value={data.product.name} />
						<p class="text-sm font-medium text-gray-700">
							Du kan claime dette produktet for {creditCost}
							{creditCost === 1 ? 'bong' : 'bonger'}.
						</p>
						<Button
							type="button"
							class="w-full sm:w-auto"
							disabled={claimLoading}
							onclick={openConfirmation}
						>
							{claimLoading ? 'Laster...' : 'Claim produkt'}
						</Button>
					</form>

					{#if claimFeedback}
						<p
							class="text-sm"
							class:text-green-700={claimFeedback.type === 'success'}
							class:text-red-600={claimFeedback.type === 'error'}
						>
							{claimFeedback.message}
						</p>
					{/if}
				{:else if data.product.priceList.credits && data.product.priceList.credits > 0}
					<p class="rounded-lg bg-white/60 p-4 text-sm text-gray-700">
						Logg inn for å claime dette produktet med bonger.
					</p>
				{/if}
			</div>

			<!-- Desktop Product Details - Only visible on desktop, under pricing -->
			<ProductDetailsCard details={metadata.slice(0, 4)} class="hidden lg:block" />
		</div>
	</div>

	<!-- Mobile Product Details - Only visible on mobile, at the bottom -->
	<ProductDetailsCard details={metadata.slice(0, 4)} class="mt-8 lg:hidden" />
</div>

<ClaimConfirmationModal
	open={showConfirmation}
	productName={data.product.name}
	{creditCost}
	onCancel={cancelConfirmation}
	onConfirm={submitClaimFromModal}
/>

<ClaimVerificationScreen
	open={showVerification}
	product={data.product}
	{timerSeconds}
	{remainingCredits}
	onClose={closeVerification}
/>
