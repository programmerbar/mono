<script>
	import { Smile, Beer, Wine, Wifi } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Om oss — Programmerbar</title>
</svelte:head>

<div class="space-y-8 py-10 max-w-2xl mx-auto">
	<h1 class="text-4xl font-medium text-center font-mono">Om oss</h1>

	<div class="h-72 w-full flex gap-4 justify-center items-center border-2 rounded-xl bg-gray-100">
		<Smile class="w-16 h-16 text-primary" />
		<Beer class="w-16 h-16 text-primary" />
		<Wine class="w-16 h-16 text-primary" />
		<Wifi class="w-16 h-16 text-primary" />
	</div>

	<p class="text-lg text-gray-800">
		Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
		the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
		of type and scrambled it to make a type specimen book. It has survived not only five centuries,
		but also the leap into electronic typesetting, remaining essentially unchanged. It was
		popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
		and more recently with desktop publishing software like Aldus PageMaker including versions of
		Lorem Ipsum.
	</p>
</div>
