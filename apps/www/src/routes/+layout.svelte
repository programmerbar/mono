<script lang="ts">
	import { setAuthContext } from '$lib/context/user.context';
	import '../tailwind.css';

	const { data, children } = $props();

	setAuthContext({
		get user() {
			return data.user;
		}
	});
</script>

{@render children()}
