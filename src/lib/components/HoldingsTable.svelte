<script lang="ts">
	import { portfolio } from '$lib/stores/portfolio.svelte.js';

	let showAddForm = $state(false);
	let newCoinId = $state('');
	let newAmount = $state(0);
	let newPrice = $state(0);
	let addError = $state('');

	let filtered = $derived.by(() => {
		return portfolio.holdings;
	});

	function getPrice(coinId: string) {
		return portfolio.prices[coinId]?.usd || 0;
	}

	function getChange(coinId: string) {
		return portfolio.prices[coinId]?.usd_24h_change;
	}

	async function addHolding() {
		addError = '';
		try {
			await portfolio.addHolding({ coinId: newCoinId, amount: Number(newAmount), purchasePrice: Number(newPrice) || undefined });
			showAddForm = false;
			newCoinId = '';
			newAmount = 0;
			newPrice = 0;
		} catch (err: any) {
			addError = err.message;
		}
	}

	async function confirmRemove(id: string) {
		if (confirm('Remove this holding?')) {
			await portfolio.removeHolding(id);
		}
	}
</script>

<div class="holdings panel">
	<div class="header">
		<h2>Holdings</h2>
		<button class="btn btn--sm btn--primary" onclick={() => showAddForm = !showAddForm}>
			{showAddForm ? 'Cancel' : '+ Add'}
		</button>
	</div>

	{#if showAddForm}
		<form onsubmit={addHolding} class="add-form">
			<input class="input" placeholder="Coin ID (e.g., bitcoin)" bind:value={newCoinId} required />
			<input class="input" type="number" step="any" placeholder="Amount" bind:value={newAmount} required />
			<input class="input" type="number" step="any" placeholder="Purchase price (USD)" bind:value={newPrice} />
			<button type="submit" class="btn btn--primary btn--sm">Save</button>
			{#if addError}<p class="error">{addError}</p>{/if}
		</form>
	{/if}

	{#if portfolio.holdings.length === 0}
		<p class="empty">No holdings yet. Add coins or import a wallet.</p>
	{:else}
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Coin</th>
						<th>Amount</th>
						<th>Price</th>
						<th>24h</th>
						<th>Value</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as h (h.id)}
						<tr>
							<td class="coin-name">{h.coinId}</td>
							<td>{h.amount}</td>
							<td>${getPrice(h.coinId).toFixed(2)}</td>
							<td class={getChange(h.coinId) >= 0 ? 'positive' : 'negative'}>
								{getChange(h.coinId)?.toFixed(2) ?? '--'}%
							</td>
							<td class="value-cell">${(h.amount * getPrice(h.coinId)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
							<td><button class="btn btn--ghost btn--sm" onclick={() => confirmRemove(h.id)}>✕</button></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.holdings { padding: var(--s4); }
	.header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--s3); }
	h2 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: var(--wave-mid); }
	.add-form { display: flex; gap: var(--s2); flex-wrap: wrap; margin-bottom: var(--s3); padding: var(--s3); background: var(--linen); border-radius: var(--radius); }
	.add-form .input { flex: 1; min-width: 120px; }
	.error { color: var(--crimson); font-size: 0.82rem; width: 100%; }
	.empty { color: var(--wave-mid); text-align: center; padding: var(--s5) 0; font-size: 0.9rem; }
	.table-wrap { overflow-x: auto; }
	table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
	th { text-align: left; padding: var(--s1) var(--s2); border-bottom: var(--border-thin); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--wave-mid); }
	td { padding: var(--s2); border-bottom: 1px solid var(--linen-2); }
	.coin-name { font-weight: 700; }
	.positive { color: var(--matcha); }
	.negative { color: var(--crimson); }
	.value-cell { font-family: var(--serif); font-weight: 700; }
</style>
