<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth.svelte.js';
	import { goto } from '$app/navigation';
	import KoshiPattern from './KoshiPattern.svelte';

	let scrolled = $state(false);

	onMount(() => {
		function onScroll() {
			scrolled = window.scrollY > 8;
		}
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function handleLogout() {
		auth.logout();
		goto('/login');
	}
</script>

<nav class:scrolled>
	<div class="nav-pattern" aria-hidden="true"><KoshiPattern /></div>
	<div class="nav-inner">
		<a href="/dashboard" class="brand">
			<svg viewBox="0 0 24 24" width="20" height="20" fill="var(--wave-foam)" aria-hidden="true">
				<rect x="3" y="4" width="4" height="16" rx="0.5" />
				<rect x="9" y="4" width="3" height="16" rx="0.5" />
				<rect x="14" y="4" width="5" height="16" rx="0.5" />
				<rect x="21" y="4" width="2" height="16" rx="0.5" />
			</svg>
			Kaze
		</a>
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
	nav { position: sticky; top: 0; z-index: 100; background: var(--wave-deep); color: var(--wave-foam); padding: var(--s2) var(--s4); border-bottom: 4px solid var(--vermilion); overflow: hidden; transition: box-shadow .25s ease; }
	nav.scrolled { box-shadow: 0 4px 20px rgba(0,0,0,0.25); }
	.nav-pattern { position: absolute; inset: 0; z-index: 0; color: var(--wave-foam); opacity: .08; }
	.nav-pattern :global(svg) { width: 100%; height: 100%; }
	.nav-inner { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
	.brand { font-family: var(--serif); font-size: 1.2rem; color: var(--wave-foam); text-decoration: none; display: flex; align-items: center; gap: var(--s2); transition: color .3s; position: relative; }
	.brand::after {
		content: ''; position: absolute; bottom: -2px; left: 50%; width: 0; height: 2px;
		background: var(--gold); transition: width .3s, left .3s;
	}
	.brand:hover { color: var(--gold); }
	.brand:hover::after { width: 70%; left: 15%; }
	.nav-right { display: flex; align-items: center; gap: var(--s3); }
	.nav-right .btn--ghost { color: var(--linen); border-color: rgba(255,255,255,0.4); }
	.nav-right .btn--ghost:hover { background: rgba(255,255,255,0.1); }
	.username { font-size: 0.85rem; opacity: 0.9; }
</style>
