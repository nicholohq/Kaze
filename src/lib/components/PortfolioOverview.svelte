<script lang="ts">
	import { portfolio } from '$lib/stores/portfolio.svelte.js';

	let formattedValue = $derived(
		new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
			.format(portfolio.totalValue)
	);

	let changeClass = $derived(portfolio.totalChange24h >= 0 ? 'positive' : 'negative');
	let changeArrow = $derived(portfolio.totalChange24h >= 0 ? '\u25B2' : '\u25BC');
	let changeText = $derived(`${changeArrow} ${Math.abs(portfolio.totalChange24h).toFixed(2)}% (24h)`);
</script>

<div class="overview panel">
	<h2>Portfolio</h2>
	<div class="value">{formattedValue}</div>
	<div class="change {changeClass}">{changeText}</div>
	<div class="holdings-count">
		{portfolio.holdings.length} {portfolio.holdings.length === 1 ? 'asset' : 'assets'}
	</div>
</div>

<style>
	.overview { padding: var(--s4); text-align: center; }
	h2 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: var(--wave-mid); margin-bottom: var(--s2); }
	.value { font-family: var(--serif); font-size: 2.2rem; font-weight: 700; color: var(--ink); }
	.change { font-size: 1rem; font-weight: 700; margin-top: var(--s1); }
	.positive { color: var(--matcha); }
	.negative { color: var(--crimson); }
	.holdings-count { font-size: 0.82rem; color: var(--wave-mid); margin-top: var(--s2); }
</style>
