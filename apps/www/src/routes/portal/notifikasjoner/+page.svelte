<script lang="ts">
	import { enhance } from '$app/forms';
	import { Check } from '@lucide/svelte';

	let { data } = $props();
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-2xl font-bold">Notifikasjoner</h1>

	<div class="flex flex-col gap-4">
		{#each data.notifications as notification (notification.id)}
			<div class="flex items-center justify-between rounded-lg border bg-white p-4">
				<div>
					<h2 class="text-lg font-bold">{notification.title}</h2>
					<p>{notification.body}</p>
				</div>

				<form action="?/archive" method="post" use:enhance>
					<input type="hidden" name="notificationId" value={notification.id} />
					<button>
						<Check class="hover:bg-background size-9 rounded-lg p-2 text-green-600" />
					</button>
				</form>
			</div>
		{:else}
			<p>Her er ingen notifikasjoner</p>
		{/each}
	</div>
</div>
