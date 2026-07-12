<script lang="ts">
	import { portfolio } from '$lib/stores/portfolio.svelte.js';
	import Sparkline from './Sparkline.svelte';

	let search = $state('');

	let filtered = $derived.by(() => {
		let coins = portfolio.marketCoins;
		if (search) {
			const q = search.toLowerCase();
			coins = coins.filter((c: any) => c.name?.toLowerCase().includes(q) || c.symbol?.toLowerCase().includes(q));
		}
		return coins;
	});
</script>

<div class="market panel">
	<div class="header">
		<h2>Market Rankings</h2>
		<input class="input" placeholder="Search coins..." bind:value={search} style="max-width:200px;" />
	</div>

	{#if portfolio.marketCoins.length === 0}
		<p class="empty">Loading market data...</p>
	{:else}
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>#</th>
						<th>Coin</th>
						<th>Price</th>
						<th>24h</th>
						<th>7d</th>
						<th>Market Cap</th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as coin, i}
						<tr>
							<td class="rank">{coin.market_cap_rank || i + 1}</td>
							<td class="coin-cell">
								<img src={coin.image} alt={coin.name} width="20" height="20" />
								<span class="name">{coin.name}</span>
								<span class="symbol">{coin.symbol?.toUpperCase()}</span>
							</td>
							<td class="price">${coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</td>
							<td class={coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
								{coin.price_change_percentage_24h?.toFixed(2)}%
							</td>
							<td>
								<Sparkline data={coin.sparkline_in_7d?.price} color={coin.price_change_percentage_7d_in_currency >= 0 ? 'var(--matcha)' : 'var(--crimson)'} />
							</td>
							<td class="mcap">${(coin.market_cap / 1e9).toFixed(2)}B</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.market { padding: var(--s4); }
	.header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--s3); flex-wrap: wrap; gap: var(--s2); }
	h2 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: var(--wave-mid); }
	.empty { color: var(--wave-mid); text-align: center; padding: var(--s5) 0; }
	.table-wrap { overflow-x: auto; }
	table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
	th { text-align: left; padding: var(--s1) var(--s2); border-bottom: var(--border-thin); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--wave-mid); }
	td { padding: var(--s2); border-bottom: 1px solid var(--linen-2); white-space: nowrap; }
	.rank { color: var(--wave-mid); font-size: 0.8rem; width: 30px; }
	.coin-cell { display: flex; align-items: center; gap: var(--s2); }
	.coin-cell img { border-radius: 50%; }
	.name { font-weight: 700; }
	.symbol { color: var(--wave-mid); font-size: 0.78rem; }
	.positive { color: var(--matcha); font-weight: 600; }
	.negative { color: var(--crimson); font-weight: 600; }
	.price { font-family: var(--serif); }
	.mcap { font-size: 0.82rem; color: var(--wave-mid); }
</style>
