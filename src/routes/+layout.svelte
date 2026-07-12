<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth.svelte.js';

	let { children } = $props();

	onMount(() => {
		auth.check();
	});
</script>

{#if auth.loading}
	<div style="display:flex;align-items:center;justify-content:center;height:100vh;">
		<p>Loading...</p>
	</div>
{:else}
	{@render children()}
{/if}
