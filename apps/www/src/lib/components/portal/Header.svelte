<script lang="ts">
	import logo from '$lib/assets/programmerbar-modern.svg';
	import { page } from '$app/stores';
	$: user = $page.data.user;
</script>

<div class="bg-background sticky top-0 z-10 border-b p-4">
	<header class="mx-auto flex max-w-screen-md items-center justify-between">
		<a href="/" class="mr-10">
			<img src={logo} alt="Logo" class="h-12 w-12" />
		</a>

		<nav>
			<ul class="mt-4 flex gap-2">
				<li>
					<a class="px-1 text-gray-500 transition hover:text-gray-900" href="/portal">Hjem</a>
				</li>
				<li>
					<a class="px-1 text-gray-500 transition hover:text-gray-900" href="/portal/status"
						>Status</a
					>
				</li>
				<li>
					<a class="px-1 text-gray-500 transition hover:text-gray-900" href="/portal/claim-beer"
						>Cash Out</a
					>
				</li>
				<li>
					<a class="px-1 text-gray-500 transition hover:text-gray-900" href="/portal/arrangementer"
						>Arrangement</a
					>
				</li>
				<li>
					<a class="px-1 text-gray-500 transition hover:text-gray-900" href="/portal/brukere"
						>Brukere</a
					>
				</li>

				{#if user.role === 'board'}
					<li>
						<a class="px-1 text-gray-500 transition hover:text-gray-900" href="/portal/admin"
							>Admin</a
						>
					</li>
				{/if}
			</ul>
		</nav>
	</header>
</div>
