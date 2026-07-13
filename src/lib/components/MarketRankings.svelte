<script lang="ts">
	import { portfolio } from '$lib/stores/portfolio.svelte.js';

	let search = $state('');
	let showCount = $state(20);

	let filtered = $derived.by(() => {
		const coins = portfolio.marketCoins;
		if (!search) return coins.slice(0, showCount);
		const q = search.toLowerCase();
		return coins.filter(
			(c: any) =>
				c.name?.toLowerCase().includes(q) || c.symbol?.toLowerCase().includes(q)
		).slice(0, showCount);
	});

	async function addToWatchlist(coinId: string) {
		try {
			await portfolio.addToWatchlist(coinId);
		} catch (e) {
			console.error('Failed to add to watchlist:', e);
		}
	}

	function loadMore() {
		showCount += 20;
	}
</script>

<div class="rankings panel">
	<div class="header">
		<h2 class="section-title" data-kanji="市">Market Rankings</h2>
		<input class="input search" placeholder="Search coins..." bind:value={search} />
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
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as coin, i}
						<tr>
							<td class="rank">{coin.market_cap_rank ?? i + 1}</td>
							<td class="coin-cell">
								{#if coin.image}
									<img src={coin.image} alt={coin.name} width="20" height="20" />
								{/if}
								<span class="coin-name">{coin.name}</span>
								<span class="coin-symbol">{coin.symbol?.toUpperCase()}</span>
							</td>
							<td class="price">${coin.current_price?.toLocaleString()}</td>
							<td class={coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
								{coin.price_change_percentage_24h?.toFixed(2) ?? '--'}%
							</td>
							<td class={coin.price_change_percentage_7d_in_currency >= 0 ? 'positive' : 'negative'}>
								{coin.price_change_percentage_7d_in_currency?.toFixed(2) ?? '--'}%
							</td>
							<td class="cap">${coin.market_cap ? (coin.market_cap / 1e9).toFixed(2) + 'B' : '--'}</td>
							<td>
								<button class="btn btn--ghost btn--sm" onclick={() => addToWatchlist(coin.id)}>+</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		{#if showCount < portfolio.marketCoins.length}
			<div class="load-more">
				<button class="btn btn--ghost" onclick={loadMore}>Load More</button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.rankings { padding: var(--s4); }
	.header { display: flex; align-items: center; justify-content: space-between; gap: var(--s3); margin-bottom: var(--s3); flex-wrap: wrap; }
	h2 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: var(--wave-mid); }
	h2::before { font-size: 0.7rem; letter-spacing: 4px; }
	.search { max-width: 240px; }
	.empty { color: var(--wave-mid); text-align: center; padding: var(--s5) 0; font-size: 0.9rem; }
	.table-wrap { overflow-x: auto; }
	table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
	th { text-align: left; padding: var(--s1) var(--s2); border-bottom: var(--border-thin); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--wave-mid); }
	td { padding: var(--s2); border-bottom: 1px solid var(--linen-2); vertical-align: middle; }
	.rank { color: var(--wave-mid); font-size: 0.8rem; }
	.coin-cell { display: flex; align-items: center; gap: var(--s2); }
	.coin-cell img { border-radius: 50%; }
	.coin-name { font-weight: 600; }
	.coin-symbol { color: var(--wave-mid); font-size: 0.75rem; }
	.price { font-family: var(--serif); font-weight: 700; }
	.positive { color: var(--matcha); }
	.negative { color: var(--crimson); }
	.cap { color: var(--wave-mid); font-size: 0.8rem; }
	.load-more { text-align: center; margin-top: var(--s3); }
</style>
