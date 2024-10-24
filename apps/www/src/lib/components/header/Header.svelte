<script lang="ts">
	import logo from '$lib/assets/programmerbar-modern.svg';
	import HeaderItem from './HeaderItem.svelte';
</script>

<header class="flex justify-between w-full py-8 mx-auto max-w-screen-lg px-4">
	<a href="/">
		<img src={logo} class="h-20 w-20" alt="ProgrammerBar Logo" />
	</a>

	<ul class="flex items-center gap-4">
		<HeaderItem to="/" name="/hjem" />
		<HeaderItem to="/meny" name="/meny" />
		<HeaderItem to="https://forms.gle/BLdygdoRJgjMbQZj6" name="/booking" />
		<HeaderItem to="/om-oss" name="/om oss" />
	</ul>
</header>
