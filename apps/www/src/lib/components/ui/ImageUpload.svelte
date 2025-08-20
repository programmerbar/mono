<script lang="ts">
	import { X, Image as ImageIcon } from '@lucide/svelte';
	import Button from './Button.svelte';
	import { cn } from '$lib/cn';

	interface ImageUploadProps {
		type: 'product' | 'producer';
		currentImageId?: string | null;
		onUpload?: (imageId: string) => void;
		onRemove?: () => void;
		class?: string;
	}

	let {
		type,
		currentImageId = null,
		onUpload,
		onRemove,
		class: className = ''
	}: ImageUploadProps = $props();

	let fileInput = $state<HTMLInputElement | null>(null);
	let isUploading = $state(false);
	let uploadError = $state<string | null>(null);
	let dragOver = $state(false);

	const handleFileSelect = async (file: File) => {
		if (!file) return;

		if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
			uploadError = 'Only JPEG, PNG, and WebP files are allowed';
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			uploadError = 'File must be smaller than 5MB';
			return;
		}

		isUploading = true;
		uploadError = null;

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('type', type);

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Upload failed');
			}

			const result = (await response.json()) as { imageId: string };
			onUpload?.(result.imageId);
		} catch (error) {
			uploadError = error instanceof Error ? error.message : 'Upload failed';
		} finally {
			isUploading = false;
		}
	};

	const handleInputChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			handleFileSelect(file);
		}
	};

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		dragOver = false;

		const file = event.dataTransfer?.files[0];
		if (file) {
			handleFileSelect(file);
		}
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		dragOver = true;
	};

	const handleDragLeave = () => {
		dragOver = false;
	};

	const removeImage = () => {
		onRemove?.();
		uploadError = null;
	};
</script>

<div class={cn('space-y-4', className)}>
	<div class="flex items-center justify-between">
		<span class="block text-sm font-medium text-gray-700">
			{type === 'product' ? 'Produktbilde' : 'Logo'}
		</span>
		{#if currentImageId}
			<Button type="button" onclick={removeImage} class="text-sm text-red-600 hover:text-red-700">
				<X class="mr-1 h-4 w-4" />
				Fjern
			</Button>
		{/if}
	</div>

	{#if currentImageId}
		<div class="relative">
			<img
				src="/api/images/{currentImageId}"
				alt={type === 'product' ? 'Produktbilde' : 'Logo'}
				class="h-32 w-32 rounded-lg border border-gray-200 object-cover"
			/>
		</div>
	{:else}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
				dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
			}`}
			ondrop={handleDrop}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
		>
			<input
				bind:this={fileInput}
				type="file"
				accept="image/jpeg,image/jpg,image/png,image/webp"
				onchange={handleInputChange}
				class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
				disabled={isUploading}
			/>

			<div class="space-y-2">
				{#if isUploading}
					<div class="mx-auto h-12 w-12 text-blue-400">
						<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-400"></div>
					</div>
					<p class="text-sm text-gray-600">Laster opp...</p>
				{:else}
					<ImageIcon class="mx-auto h-12 w-12 text-gray-400" />
					<div class="space-y-1">
						<p class="text-sm text-gray-600">
							<span class="cursor-pointer font-medium text-blue-600 hover:text-blue-500">
								Klikk for å laste opp
							</span>
							eller dra og slipp
						</p>
						<p class="text-xs text-gray-500">PNG, JPG, WebP opptil 5MB</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	{#if uploadError}
		<p class="text-sm text-red-600">{uploadError}</p>
	{/if}
</div>
