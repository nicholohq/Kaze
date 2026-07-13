<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth.svelte.js';
	import { portfolio } from '$lib/stores/portfolio.svelte.js';
	import { goto } from '$app/navigation';
	import Nav from '$lib/components/Nav.svelte';
	import GreatWaveArt from '$lib/components/GreatWaveArt.svelte';
	import WalletConnect from '$lib/components/WalletConnect.svelte';
	import AddressInput from '$lib/components/AddressInput.svelte';
	import { reveal } from '$lib/actions.js';

	let walletAddress = $state('');

	onMount(() => {
		if (!auth.user) goto('/login');
		walletAddress = auth.user?.walletAddress || '';
	});

	function onWalletConnected(detail: { address: string }) {
		walletAddress = detail.address;
		// TODO: persist wallet address to user profile via API
	}
</script>

<svelte:head>
	<title>Kaze — Settings</title>
</svelte:head>

<Nav />
<GreatWaveArt />

<main class="settings">
	<h1 class="section-title" data-kanji="設">Settings</h1>

	<div class="section panel reveal" use:reveal>
		<h2 class="section-title" data-kanji="帳">Account</h2>
		<p>Username: <strong>{auth.user?.username}</strong></p>
	</div>

	<div class="section panel reveal" use:reveal>
		<h2 class="section-title" data-kanji="財">Wallet</h2>
		{#if walletAddress}
			<p class="address">Connected: <code>{walletAddress}</code></p>
		{:else}
			<p class="desc">Connect a wallet to import holdings.</p>
			<WalletConnect onconnected={onWalletConnected} />
			<div class="divider"><span>or</span></div>
			<AddressInput onconnected={onWalletConnected} />
		{/if}
	</div>


</main>

<style>
	.settings { max-width: 600px; margin: 0 auto; padding: var(--s4); }
	h1 { font-size: 1.4rem; margin-bottom: var(--s4); }
	h1.section-title::before { font-size: 0.8rem; }
	.section { padding: var(--s4); margin-bottom: var(--s4); }
	.section .section-title { font-size: 0.85rem; text-transform: uppercase; color: var(--wave-mid); margin-bottom: var(--s3); letter-spacing: 1px; }
	.section .section-title::before { font-size: 0.7rem; letter-spacing: 4px; }
	.section .desc { font-size: 0.85rem; color: var(--wave-mid); margin-bottom: var(--s3); }
	.address { font-size: 0.85rem; }
	.address code { background: var(--linen-2); padding: 2px var(--s1); border-radius: 4px; word-break: break-all; font-size: 0.8rem; }
	.divider { display: flex; align-items: center; gap: var(--s2); margin: var(--s3) 0; color: var(--wave-mid); font-size: 0.82rem; }
	.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--linen-2); }
</style>
