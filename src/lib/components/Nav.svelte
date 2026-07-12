<script lang="ts">
	import { auth } from '$lib/stores/auth.svelte.js';
	import { goto } from '$app/navigation';

	function handleLogout() {
		auth.logout();
		goto('/login');
	}
</script>

<nav>
	<div class="nav-inner">
		<a href="/dashboard" class="brand">🌊 Kaze</a>
		<div class="nav-right">
			<a href="/settings" class="btn btn--ghost btn--sm">Settings</a>
			{#if auth.user}
				<span class="username">{auth.user.username}</span>
				<button class="btn btn--ghost btn--sm" onclick={handleLogout}>Logout</button>
			{:else}
				<a href="/login" class="btn btn--sm">Sign In</a>
			{/if}
		</div>
	</div>
</nav>

<style>
	nav { background: var(--wave-deep); color: var(--wave-foam); padding: var(--s2) var(--s4); }
	.nav-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
	.brand { font-family: var(--serif); font-size: 1.2rem; color: var(--wave-foam); text-decoration: none; }
	.nav-right { display: flex; align-items: center; gap: var(--s3); }
	.username { font-size: 0.85rem; opacity: 0.8; }
</style>
