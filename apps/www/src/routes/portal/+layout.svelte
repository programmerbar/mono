<script lang="ts">
	import logo from '$lib/assets/programmerbar-modern.svg';

	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
	<div class="p-4 border-b sticky top-0 bg-background">
		<header class="flex items-center justify-between max-w-screen-md mx-auto">
			<a href="/" class="mr-10">
				<img src={logo} alt="Logo" class="h-12 w-12" />
			</a>

			<nav>
				<ul class="flex gap-2 mt-4">
					<li>
						<a class="px-1 text-gray-500 hover:text-gray-900 transition" href="/portal">Hjem</a>
					</li>
					<li>
						<a class="px-1 text-gray-500 hover:text-gray-900 transition" href="/portal/status"
							>Status</a
						>
					</li>
					<!-- <li>
						<a class="px-1 text-gray-500 hover:text-gray-900 transition" href="/portal/vakter"
							>Vakter</a
						>
					</li> -->
					<li>
						<a class="px-1 text-gray-500 hover:text-gray-900 transition" href="/portal/brukere"
							>Brukere</a
						>
					</li>
				</ul>
			</nav>
		</header>
	</div>

	<div class="flex-1 bg-white py-10 px-4">
		<div class="max-w-screen-md mx-auto">
			{@render children()}
		</div>
	</div>
</div>
