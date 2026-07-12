<script lang="ts">
	import { portfolio } from '$lib/stores/portfolio.svelte.js';

	let watchedCoins = $derived(
		portfolio.marketCoins.filter((c: any) =>
			portfolio.watchlist.some((w: any) => w.coinId === c.id)
		)
	);

	async function remove(coinId: string) {
		const entry = portfolio.watchlist.find((w: any) => w.coinId === coinId);
		if (entry) await portfolio.removeFromWatchlist(entry.id);
	}
</script>

<div class="watchlist panel">
	<h2>Watchlist</h2>
	{#if portfolio.watchlist.length === 0}
		<p class="empty">No coins watched yet. Add coins from the market rankings.</p>
	{:else}
		<div class="list">
			{#each watchedCoins as coin (coin.id)}
				<div class="item">
					<img src={coin.image} alt={coin.name} width="20" height="20" />
					<span class="name">{coin.name}</span>
					<span class="price">${coin.current_price?.toFixed(2)}</span>
					<span class={coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
						{coin.price_change_percentage_24h?.toFixed(2)}%
					</span>
					<button class="btn btn--ghost btn--sm" onclick={() => remove(coin.id)}>✕</button>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.watchlist { padding: var(--s4); }
	h2 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: var(--wave-mid); margin-bottom: var(--s3); }
	.empty { color: var(--wave-mid); text-align: center; padding: var(--s4) 0; font-size: 0.85rem; }
	.list { display: flex; flex-direction: column; gap: var(--s2); }
	.item { display: flex; align-items: center; gap: var(--s2); padding: var(--s1) 0; border-bottom: 1px solid var(--linen-2); font-size: 0.88rem; }
	.item img { border-radius: 50%; }
	.name { flex: 1; font-weight: 600; }
	.price { font-family: var(--serif); min-width: 70px; text-align: right; }
	.positive { color: var(--matcha); font-weight: 600; min-width: 60px; text-align: right; }
	.negative { color: var(--crimson); font-weight: 600; min-width: 60px; text-align: right; }
</style>
