<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth.svelte.js';
	import { portfolio } from '$lib/stores/portfolio.svelte.js';
	import { goto } from '$app/navigation';
	import Nav from '$lib/components/Nav.svelte';
	import InkWash from '$lib/components/InkWash.svelte';
	import JapanesePattern from '$lib/components/JapanesePattern.svelte';
	import KoshiPattern from '$lib/components/KoshiPattern.svelte';
	import WalletConnect from '$lib/components/WalletConnect.svelte';
	import AddressInput from '$lib/components/AddressInput.svelte';
	import PortfolioOverview from '$lib/components/PortfolioOverview.svelte';
	import HoldingsTable from '$lib/components/HoldingsTable.svelte';
	import PortfolioChart from '$lib/components/PortfolioChart.svelte';
	import MarketRankings from '$lib/components/MarketRankings.svelte';
	import Watchlist from '$lib/components/Watchlist.svelte';
	import Chochin from '$lib/components/Chochin.svelte';
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

<header class="dash-hero">
	<InkWash position="left" intensity={0.12} color="90,62,40" />
	<div class="dash-hero__pattern" aria-hidden="true">
		<KoshiPattern />
	</div>
	<span class="dash-hero__watermark" aria-hidden="true">風</span>
	<div class="dash-hero__inner">
		<div class="dash-hero__titles">
			<p class="dash-hero__kanji" aria-hidden="true">かぜ</p>
			<h1 class="dash-hero__brand">Kaze</h1>
			<p class="dash-hero__tagline">風の見晴らし — your portfolio at a glance</p>
		</div>
		<button class="btn btn--primary" onclick={() => showWalletImport = !showWalletImport}>
			{showWalletImport ? 'Cancel' : '+ Import Wallet'}
		</button>
	</div>
</header>

<main class="dashboard">
	{#if importMessage}
		<div class="import-msg-wrap">
			{#key importMessage}
				<Chochin
					type={importMessage.startsWith('Import failed') ? 'error' : 'success'}
					message={importMessage}
					onDismiss={() => (importMessage = '')}
				/>
			{/key}
		</div>
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
	/* ============ DASHBOARD HERO ============ */
	.dash-hero {
		position: relative;
		overflow: hidden;
		min-height: 140px;
		display: flex;
		align-items: center;
		background: linear-gradient(180deg, var(--linen) 0%, var(--paper) 100%);
		border-bottom: 1px solid var(--linen-2);
	}
	.dash-hero__pattern {
		position: absolute; inset: 0 0 0 auto; width: 38%; z-index: 0;
		-webkit-mask-image: linear-gradient(90deg, transparent, #000 60%);
		mask-image: linear-gradient(90deg, transparent, #000 60%);
		color: var(--koshi);
		opacity: 0.15;
	}
	.dash-hero__watermark {
		position: absolute; right: 0.1em; top: 50%; transform: translateY(-50%);
		font-family: var(--serif); font-weight: 900;
		font-size: clamp(7rem, 18vw, 12rem); line-height: 1;
		color: var(--wave-deep); opacity: 0.05;
		pointer-events: none; user-select: none; z-index: 0;
		color: var(--koshi);
	}
	.dash-hero__inner {
		position: relative; z-index: 1;
		max-width: 1200px; width: 100%; margin: 0 auto;
		padding: var(--s4) var(--s5);
		display: flex; align-items: center; justify-content: space-between; gap: var(--s4);
	}
	.dash-hero__kanji {
		font-family: var(--serif); font-size: 0.8rem; letter-spacing: 0.5em;
		color: var(--vermilion); font-weight: 700; margin-bottom: 0.1rem;
	}
	.dash-hero__brand {
		font-family: var(--serif); font-weight: 900;
		font-size: clamp(2rem, 5vw, 3rem); line-height: 1;
		color: var(--charcoal); letter-spacing: 0.02em;
	}
	.dash-hero__tagline {
		margin-top: var(--s2); font-size: 0.85rem; color: var(--wave-mid); letter-spacing: 0.3px;
	}

	/* ============ LAYOUT ============ */
	.dashboard { max-width: 1200px; margin: 0 auto; padding: var(--s5) var(--s5) var(--s6); }
	.import-msg-wrap { margin-bottom: var(--s4); }
	.wallet-section { padding: var(--s5); margin-bottom: var(--s5); }
	.wallet-section h3 { margin-bottom: var(--s2); }
	.wallet-section .desc { font-size: 0.85rem; color: var(--wave-mid); margin-bottom: var(--s3); }
	.divider { display: flex; align-items: center; gap: var(--s2); margin: var(--s3) 0; color: var(--wave-mid); font-size: 0.82rem; }
	.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--linen-2); }
	.loading-text { text-align: center; padding: var(--s6); color: var(--wave-mid); }

	/* ============ SOFT UKIYO-E CARDS (dashboard-scoped) ============ */
	.dashboard :global(.panel) {
		border: 1px solid var(--linen-2);
		box-shadow: var(--shadow-ukiyoe);
		border-radius: 10px;
	}
	.dashboard :global(.panel:hover) {
		transform: translateY(-3px);
		box-shadow: var(--shadow-emaki);
	}

	/* ============ GRID (more Ma) ============ */
	.grid { display: grid; grid-template-columns: 1fr; gap: var(--s4); }
	@media (min-width: 768px) {
		.grid { grid-template-columns: 280px 1fr; gap: var(--s5); }
		.grid-overview { grid-column: 1; grid-row: 1; }
		.grid-chart { grid-column: 2; grid-row: 1; }
		.grid-main { grid-column: 1 / -1; }
		.grid-side { grid-column: 1 / -1; }
		.grid-full { grid-column: 1 / -1; }
	}
	@media (min-width: 1024px) {
		.grid { grid-template-columns: 280px 1fr 240px; }
		.grid-overview { grid-column: 1; grid-row: 1; }
		.grid-chart { grid-column: 2 / 4; grid-row: 1; }
		.grid-main { grid-column: 1 / 3; grid-row: 2; }
		.grid-side { grid-column: 3; grid-row: 2; }
		.grid-full { grid-column: 1 / -1; grid-row: 3; }
	}
</style>
