<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Kaze — Error</title>
</svelte:head>

<div class="error-page">
	<div class="error-card panel">
		<div class="error-icon">
			<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="var(--vermilion)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="24" cy="24" r="20" />
				<line x1="16" y1="16" x2="32" y2="32" />
				<line x1="32" y1="16" x2="16" y2="32" />
			</svg>
		</div>
		<h1>Something went wrong</h1>
		<p class="status">{$page.status}</p>
		{#if $page.error}
			<p class="message">{$page.error.message}</p>
		{/if}
		<a href="/" class="btn btn--primary">Go Home</a>
	</div>
</div>

<style>
	.error-page { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: var(--s4); }
	.error-card { padding: var(--s6); text-align: center; max-width: 420px; }
	.error-icon { margin-bottom: var(--s3); display: flex; justify-content: center; }
	h1 { font-size: 1.5rem; margin-bottom: var(--s2); }
	.status { font-family: var(--serif); font-size: 3rem; color: var(--vermilion); margin-bottom: var(--s2); }
	.message { font-size: 0.88rem; color: var(--wave-mid); margin-bottom: var(--s5); }
</style>
