<script lang="ts">
	import { outsideClick } from '$lib/actions/outside-click';
	import { cn } from '$lib/cn';
	import type { ChangeEventHandler } from 'svelte/elements';

	const MAX_HOUR = 23;
	const MAX_MINUTE = 59;
	const MIN_HOUR = 0;
	const MIN_MINUTE = 0;

	let selectedHour = $state(0);
	let seelctedMinute = $state(0);

	let isOpen = $state(false);

	const handleHourInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const value = parseInt(event.currentTarget.value, 10);

		if (value >= MIN_HOUR && value <= MAX_HOUR) {
			selectedHour = value;
		}
	};

	const handleMinuteInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const value = parseInt(event.currentTarget.value, 10);

		if (value >= MIN_MINUTE && value <= MAX_MINUTE) {
			seelctedMinute = value;
		}
	};
</script>

<div
	class="w-fit border rounded-lg px-2 relative bg-background h-10 border-gray-200"
	use:outsideClick={() => {
		if (isOpen) {
			isOpen = false;
		}
	}}
>
	<div class="flex items-center w-fit h-full justify-center">
		<input
			type="text"
			class="bg-transparent border-none text-center w-14 outline-none ring-0"
			value={selectedHour.toString().padStart(2, '0')}
			onclick={() => (isOpen = true)}
			onchange={handleHourInputChange}
		/>

		<span>:</span>

		<input
			type="text"
			class="bg-transparent border-none text-center w-14 outline-none ring-0"
			value={seelctedMinute.toString().padStart(2, '0')}
			onclick={() => (isOpen = true)}
			onchange={handleMinuteInputChange}
		/>
	</div>

	{#if isOpen}
		<div
			class="absolute flex gap-2 h-[250px] bg-background p-2 z-50 border border-gray-200 rounded-lg"
		>
			<ul class="overflow-y-scroll h-full w-full pr-4">
				{#each Array.from({ length: MAX_HOUR - MIN_HOUR + 1 }, (_, i) => i + MIN_HOUR) as i}
					<li>
						<button
							class={cn('px-2 h-10 hover:bg-slate-200 rounded-lg', {
								'bg-slate-200': i === selectedHour
							})}
							onclick={() => (selectedHour = i)}>{i.toString().padStart(2, '0')}</button
						>
					</li>
				{/each}
			</ul>

			<ul class="overflow-y-scroll h-full w-full pr-4">
				{#each Array.from({ length: MAX_MINUTE - MIN_MINUTE + 1 }, (_, i) => i + MIN_MINUTE) as i}
					<li>
						<button
							class={cn('px-2 h-10 hover:bg-slate-200 rounded-lg', {
								'bg-slate-200': i === seelctedMinute
							})}
							onclick={() => (seelctedMinute = i)}>{i.toString().padStart(2, '0')}</button
						>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
