<script lang="ts">
	import logo from '$lib/assets/programmerbar-modern.svg';
</script>

<div class="p-4 border-b sticky top-0 z-10">
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
				<li>
					<a class="px-1 text-gray-500 hover:text-gray-900 transition" href="/portal/arrangementer"
						>Arrangement</a
					>
				</li>
				<li>
					<a class="px-1 text-gray-500 hover:text-gray-900 transition" href="/portal/brukere"
						>Brukere</a
					>
				</li>
			</ul>
		</nav>
	</header>
</div>
