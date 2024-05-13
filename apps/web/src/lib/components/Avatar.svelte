<script lang="ts">
	import { cn } from '$lib/cn';
	import { Avatar } from 'bits-ui';
	// export let loadingStatus: Avatar.Props['loadingStatus'] = undefined;

	type Props = {
		src: string;
		alt: string;
		initials: string;
		class?: string;

		loadingStatus?: Avatar.Props['loadingStatus'];
	};

	let { src, alt, initials, class: className, loadingStatus = $bindable() }: Props = $props();
</script>

<Avatar.Root
	bind:loadingStatus
	class={cn(
		'h-20 w-20 rounded-full border-2 border-border text-[17px] font-medium uppercase',
		{
			'bg-muted': loadingStatus !== 'loaded'
		},
		className
	)}
>
	<div
		class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent"
	>
		<Avatar.Image {src} {alt} />
		<Avatar.Fallback class="border border-muted">{initials}</Avatar.Fallback>
	</div>
</Avatar.Root>
