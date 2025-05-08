<script lang="ts">
	import { subHours } from 'date-fns';
	import { formatDate, time } from '$lib/date';
	import { capitalize } from '$lib/utils';
	import { enhance } from '$app/forms';
	import { getUser } from '$lib/context/user.context.js';
	import { X, Plus, Calendar, Clock, Users } from '@lucide/svelte';

	let { data } = $props();
	let user = getUser();
	let activeTab = $state('details');

</script>

<svelte:head>
	<title>{data.event.name}</title>
</svelte:head>

<section class="mt-8">


<div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
	<div class="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
		<div>
			<h1 class="text-xl font-semibold text-gray-800">{data.event.name}</h1>
			<p class="text-sm text-gray-500">{formatDate(data.event.date)}</p>
		</div>
	</div>
	
		<div class="px-6 pt-4 border-b border-gray-100">
			<div class="flex gap-2">
				<button
					class={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
					onclick={() => (activeTab = 'details')}
				>
					Detaljer
				</button>
				<button
					class={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'shifts' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
					onclick={() => (activeTab = 'shifts')}
				>
					Vakter
				</button>
			</div>
		</div>
	
		<div class="p-6">
			{#if activeTab === 'details'}
				<div class="space-y-4">
					<div class="flex gap-2 items-start">
						<div class="bg-blue-50 p-2 rounded-lg">
							<Calendar size={20} class="text-blue-500" />
						</div>
						<div>
							<h3 class="font-medium">Dato</h3>
							<p>{formatDate(data.event.date)}</p>
						</div>
					</div>
					
					<div class="flex gap-2 items-start">
						<div class="bg-blue-50 p-2 rounded-lg">
							<Clock size={20} class="text-blue-500" />
						</div>
						<div>
							<h3 class="font-medium">Antall vakter</h3>
							<p>
								{data.event.shifts.length} {data.event.shifts.length === 1 ? 'vakt' : 'vakter'}
							</p>
						</div>
					</div>
					
					<div class="flex gap-2 items-start">
						<div class="bg-blue-50 p-2 rounded-lg">
							<Users size={20} class="text-blue-500" />
						</div>
						<div>
							<h3 class="font-medium">Ansvarlige</h3>
							<ul class="text-sm">
								{#each data.event.shifts as shift, i}
									<li>
										<strong>Vakt {i + 1}:</strong> {shift.members.map((member) => member.user.name).join(', ') || 'Ingen ansvarlige'}
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</div>
			{:else if activeTab === 'shifts'}
				<div class="space-y-4">
					{#each data.event.shifts as shift, i}
						{@const isInShift = shift.members.some((member) => member.userId === $user?.id)}
						<div class="rounded-lg border border-gray-200 overflow-hidden">
							<div class="bg-gray-50 px-4 py-2 border-b border-gray-200">
								<h3 class="font-medium">Vakt {i + 1}</h3>
							</div>
							<div class="p-4 space-y-2">
								<div class="grid grid-cols-2 gap-2">
									<div>
										<p class="text-sm text-gray-500">Dato</p>
										<p class="font-medium">{capitalize(formatDate(shift.startAt))}</p>
									</div>
									<div>
										<p class="text-sm text-gray-500">Tid</p>
										<p class="font-medium">{time(subHours(shift.startAt, 2))} - {time(subHours(shift.endAt, 2))}</p>
									</div>
								</div>
								
								<div>
									<p class="text-sm text-gray-500">Ansvarlige</p>
									<p class="font-medium">{shift.members.map((member) => member.user.name).join(', ') || 'Ingen ansvarlige'}</p>
								</div>
								
								{#if !isInShift}
									<form action="?/join" method="post" use:enhance>
										<input type="hidden" name="shiftId" value={shift.id} />
										<button class="inline-flex items-center text-blue-500 hover:text-blue-700 font-medium text-sm">
											<Plus size={16} />
											Bli med på vakten
										</button>
									</form>
								{:else}
									<form action="?/leave" method="post" use:enhance>
										<input type="hidden" name="shiftId" value={shift.id} />
										<button class="inline-flex items-center text-red-500 hover:text-red-700 font-medium text-sm">
											<X size={16} />
											Forlat vakten
										</button>
									</form>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
				</div>
			</div>
</section>
