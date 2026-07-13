<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth.svelte.js';
	import { portfolio } from '$lib/stores/portfolio.svelte.js';
	import { goto } from '$app/navigation';
	import Nav from '$lib/components/Nav.svelte';
	import GreatWaveArt from '$lib/components/GreatWaveArt.svelte';
	import WalletConnect from '$lib/components/WalletConnect.svelte';
	import AddressInput from '$lib/components/AddressInput.svelte';
	import PortfolioOverview from '$lib/components/PortfolioOverview.svelte';
	import HoldingsTable from '$lib/components/HoldingsTable.svelte';
	import PortfolioChart from '$lib/components/PortfolioChart.svelte';
	import MarketRankings from '$lib/components/MarketRankings.svelte';
	import Watchlist from '$lib/components/Watchlist.svelte';
	import { reveal } from '$lib/actions.js';

	let showWalletImport = $state(false);
	let importMessage = $state('');

	onMount(() => {
		if (!auth.user && !auth.loading) {
			goto('/login');
			return;
		}
		portfolio.fetchAll();
		portfolio.startPricePolling();
		return () => {
			portfolio.stopPricePolling();
		};
	});

	async function onWalletConnected(detail: { address: string }) {
		const { address } = detail;
		importMessage = '';
		try {
			await portfolio.importWallet(address);
			if (portfolio.walletData) {
				const short = address.slice(0, 6) + '...' + address.slice(-4);
				importMessage = `Imported wallet ${short}`;
			}
		} catch (e: any) {
			importMessage = `Import failed: ${e.message}`;
		}
		showWalletImport = false;
	}
</script>

<svelte:head>
	<title>Kaze — Dashboard</title>
</svelte:head>

<Nav />
<GreatWaveArt />

<main class="dashboard">
	<div class="top-bar">
		<h1 class="section-title" data-kanji="風">Kaze</h1>
		<button class="btn btn--primary btn--sm" onclick={() => showWalletImport = !showWalletImport}>
			{showWalletImport ? 'Cancel' : '+ Import Wallet'}
		</button>
	</div>

	{#if importMessage}
		<div class="import-msg panel">{importMessage}</div>
	{/if}

	{#if showWalletImport}
		<div class="wallet-section panel reveal" use:reveal>
			<h3>Import Wallet</h3>
			<p class="desc">Import holdings from MetaMask or any Ethereum address.</p>
			<WalletConnect onconnected={onWalletConnected} />
			<div class="divider"><span>or</span></div>
			<AddressInput onconnected={onWalletConnected} />
		</div>
	{/if}

	{#if portfolio.loading && portfolio.holdings.length === 0}
		<p class="loading-text">Loading portfolio data...</p>
	{:else}
		<div class="grid">
			<div class="grid-overview reveal" use:reveal>
				<PortfolioOverview />
			</div>
			<div class="grid-chart reveal" use:reveal>
				<PortfolioChart />
			</div>
			<div class="grid-main reveal" use:reveal>
				<HoldingsTable />
			</div>
			<div class="grid-side reveal" use:reveal>
				<Watchlist />
			</div>
			<div class="grid-full reveal" use:reveal>
				<MarketRankings />
			</div>
		</div>
	{/if}
</main>

<style>
	.dashboard { max-width: 1200px; margin: 0 auto; padding: var(--s4); }
	.top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--s4); }
	.top-bar .section-title { font-size: 1.4rem; margin-bottom: 0; }
	.top-bar .section-title::before { font-size: 0.8rem; }
	.import-msg { padding: var(--s2) var(--s3); margin-bottom: var(--s3); font-size: 0.85rem; color: var(--matcha); font-weight: 700; }
	.wallet-section { padding: var(--s4); margin-bottom: var(--s4); }
	.wallet-section h3 { margin-bottom: var(--s2); }
	.wallet-section .desc { font-size: 0.85rem; color: var(--wave-mid); margin-bottom: var(--s3); }
	.divider { display: flex; align-items: center; gap: var(--s2); margin: var(--s3) 0; color: var(--wave-mid); font-size: 0.82rem; }
	.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--linen-2); }
	.loading-text { text-align: center; padding: var(--s6); color: var(--wave-mid); }
	.grid { display: grid; grid-template-columns: 1fr; gap: var(--s4); }
	.grid-overview { grid-column: 1; }
	.grid-chart { grid-column: 1; }
	.grid-main { grid-column: 1; }
	.grid-side { grid-column: 1; }
	.grid-full { grid-column: 1; }
	@media (min-width: 768px) {
		.grid { grid-template-columns: 300px 1fr; }
		.grid-overview { grid-column: 1; grid-row: 1; }
		.grid-chart { grid-column: 2; grid-row: 1; }
		.grid-main { grid-column: 1 / -1; }
		.grid-side { grid-column: 1 / -1; }
		.grid-full { grid-column: 1 / -1; }
	}
</style>
