<script lang="ts">
	import { portfolio } from '$lib/stores/portfolio.svelte.js';

	let formattedValue = $derived(
		new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
			.format(portfolio.totalValue)
	);

	let changeClass = $derived(portfolio.totalChange24h >= 0 ? 'positive' : 'negative');
	let changeArrow = $derived(portfolio.totalChange24h >= 0 ? '\u25B2' : '\u25BC');
	let changeText = $derived(`${changeArrow} ${Math.abs(portfolio.totalChange24h).toFixed(2)}% (24h)`);

	let walletLabel = $derived(
		portfolio.walletData
			? portfolio.walletData.address.slice(0, 6) + '...' + portfolio.walletData.address.slice(-4)
			: ''
	);
</script>

<div class="overview panel">
	<span class="hanko overview-seal" aria-hidden="true">風</span>
	<h2 class="section-title" data-kanji="風">Portfolio</h2>
	<div class="value">{formattedValue}</div>
	<div class="change {changeClass}">{changeText}</div>
	<div class="meta">
		<span class="holdings-count">
			{portfolio.holdings.length} {portfolio.holdings.length === 1 ? 'asset' : 'assets'}
		</span>
		{#if walletLabel}
			<span class="wallet-badge" title="Connected wallet">{walletLabel}</span>
		{/if}
	</div>
</div>

<style>
	.overview { position: relative; padding: var(--s5); text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: center; }
	.overview-seal { position: absolute; top: -14px; right: -12px; z-index: 2; }
	h2 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: var(--wave-mid); margin-bottom: var(--s2); color: var(--koshi); }
	h2::before { font-size: 0.7rem; letter-spacing: 4px; }
	.value {
		font-family: var(--serif); font-size: 2.5rem; font-weight: 700; color: var(--ink);
		line-height: 1.1; margin-top: var(--s1);
		animation: value-in .6s ease both;
	}
	@keyframes value-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
	.change { font-size: 1rem; font-weight: 700; margin-top: var(--s1); }
	.positive { color: var(--matcha); }
	.negative { color: var(--crimson); }
	.meta { display: flex; flex-direction: column; gap: var(--s1); margin-top: var(--s2); }
	.holdings-count { font-size: 0.82rem; color: var(--wave-mid); }
	.wallet-badge { font-size: 0.72rem; color: var(--gold); font-family: var(--serif); letter-spacing: 0.5px; padding: 2px 8px; border: 1px solid var(--gold); border-radius: 4px; display: inline-block; margin: 0 auto; }
</style>
