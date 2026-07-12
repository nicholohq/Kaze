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

	let showWalletImport = $state(false);

	onMount(() => {
		if (!auth.user && !auth.loading) {
			goto('/login');
			return;
		}
		portfolio.fetchAll();
		portfolio.startPricePolling();
	});

	function onWalletConnected(event: CustomEvent<{ address: string }>) {
		const { address } = event.detail;
		portfolio.importWallet(address);
		showWalletImport = false;
	}
</script>

<Nav />
<GreatWaveArt />

<main class="dashboard">
	<div class="top-bar">
		<h1>Dashboard</h1>
		<button class="btn btn--primary btn--sm" onclick={() => showWalletImport = !showWalletImport}>
			{showWalletImport ? 'Cancel' : '+ Import Wallet'}
		</button>
	</div>

	{#if showWalletImport}
		<div class="wallet-section panel">
			<h3>Import Wallet</h3>
			<p class="desc">Connect MetaMask or paste an Ethereum address to automatically import token holdings.</p>
			<WalletConnect on:connected={onWalletConnected} />
			<div class="divider"><span>or</span></div>
			<AddressInput on:connected={onWalletConnected} />
		</div>
	{/if}

	{#if portfolio.loading && portfolio.holdings.length === 0}
		<p class="loading-text">Loading portfolio data...</p>
	{:else}
		<div class="grid">
			<div class="grid-overview">
				<PortfolioOverview />
			</div>
			<div class="grid-chart">
				<PortfolioChart />
			</div>
			<div class="grid-main">
				<HoldingsTable />
			</div>
			<div class="grid-side">
				<Watchlist />
			</div>
			<div class="grid-full">
				<MarketRankings />
			</div>
		</div>
	{/if}
</main>

<style>
	.dashboard { max-width: 1200px; margin: 0 auto; padding: var(--s4); }
	.top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--s4); }
	.top-bar h1 { font-size: 1.4rem; }
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
