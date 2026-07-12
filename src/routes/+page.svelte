<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth.svelte.js';
	import { goto } from '$app/navigation';

	onMount(() => {
		if (auth.user) {
			goto('/dashboard');
		} else {
			goto('/login');
		}
	});
</script>
