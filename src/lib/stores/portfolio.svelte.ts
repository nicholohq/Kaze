class PortfolioStore {
	holdings = $state<any[]>([]);
	watchlist = $state<any[]>([]);
	marketCoins = $state<any[]>([]);
	prices = $state<Record<string, { usd: number; usd_24h_change?: number }>>({});
	walletData = $state<{ address: string; ethBalance: string; tokens: any[] } | null>(null);
	loading = $state(false);
	error = $state('');

	totalValue = $derived(
		this.holdings.reduce((sum, h) => {
			const price = this.prices[h.coinId]?.usd || 0;
			return sum + (h.amount || 0) * price;
		}, 0)
	);

	totalChange24h = $derived.by(() => {
		let total = 0;
		let previous = 0;
		for (const h of this.holdings) {
			const p = this.prices[h.coinId];
			if (p && p.usd_24h_change != null) {
				const prevPrice = p.usd / (1 + p.usd_24h_change / 100);
				total += h.amount * p.usd;
				previous += h.amount * prevPrice;
			}
		}
		return previous > 0 ? ((total - previous) / previous) * 100 : 0;
	});

	async fetchPrices(coinIds: string[]) {
		if (coinIds.length === 0) return;
		try {
			const res = await fetch(`/api/market/simple?ids=${coinIds.join(',')}`);
			if (res.ok) {
				this.prices = { ...this.prices, ...(await res.json()) };
			}
		} catch (e) {
			console.error('Failed to fetch prices:', e);
		}
	}

	async fetchHoldings() {
		try {
			const res = await fetch('/api/holdings');
			if (res.ok) {
				this.holdings = await res.json();
				if (this.holdings.length > 0) {
					await this.fetchPrices(this.holdings.map((h: any) => h.coinId));
				}
			}
		} catch (e) {
			console.error('Failed to fetch holdings:', e);
		}
	}

	async fetchWatchlist() {
		try {
			const res = await fetch('/api/watchlist');
			if (res.ok) this.watchlist = await res.json();
		} catch (e) {
			console.error('Failed to fetch watchlist:', e);
		}
	}

	async fetchMarketCoins() {
		try {
			const res = await fetch('/api/market/top?per_page=100');
			if (res.ok) this.marketCoins = await res.json();
		} catch (e) {
			console.error('Failed to fetch market coins:', e);
		}
	}

	async addHolding(data: { coinId: string; amount: number; purchasePrice?: number; source?: string }) {
		const res = await fetch('/api/holdings', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
		const body = await res.json();
		if (!res.ok) throw new Error(body.error);
		this.holdings = [body, ...this.holdings];
		return body;
	}

	async removeHolding(id: string) {
		await fetch(`/api/holdings/${id}`, { method: 'DELETE' });
		this.holdings = this.holdings.filter((h: any) => h.id !== id);
	}

	async addToWatchlist(coinId: string) {
		const res = await fetch('/api/watchlist', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ coinId })
		});
		const body = await res.json();
		if (!res.ok) throw new Error(body.error);
		this.watchlist = [body, ...this.watchlist];
	}

	async removeFromWatchlist(id: string) {
		await fetch(`/api/watchlist/${id}`, { method: 'DELETE' });
		this.watchlist = this.watchlist.filter((w: any) => w.id !== id);
	}

	async importWallet(address: string) {
		this.loading = true;
		this.error = '';
		try {
			const res = await fetch('/api/wallet/balances', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ address })
			});
			const body = await res.json();
			if (!res.ok) throw new Error(body.error);
			this.walletData = body;

			const existing = new Set(this.holdings.map((h: any) => h.coinId + '|' + (h.source || '')));

			const toAdd: { coinId: string; amount: number; contractAddress?: string; source: string }[] = [];

			if (this.walletData.ethBalance && !existing.has('ethereum|wallet')) {
				const eth = Number(this.walletData.ethBalance) / 1e18;
				if (eth > 0) {
					toAdd.push({ coinId: 'ethereum', amount: eth, source: 'wallet' });
				}
			}

			if (this.walletData.tokens) {
				for (const t of this.walletData.tokens) {
					const coinId = t.symbol.toLowerCase();
					if (existing.has(coinId + '|wallet')) continue;
					const balance = Number(t.balance) / Math.pow(10, t.decimals || 18);
					if (balance > 0) {
						toAdd.push({ coinId, amount: balance, contractAddress: t.contractAddress, source: 'wallet' });
					}
				}
			}

			await Promise.all(toAdd.map(d => this.addHolding(d)));
			await this.fetchHoldings();
		} catch (err: any) {
			this.error = err.message;
		} finally {
			this.loading = false;
		}
	}

	async fetchAll() {
		this.loading = true;
		await Promise.all([
			this.fetchHoldings(),
			this.fetchWatchlist(),
			this.fetchMarketCoins()
		]);
		this.loading = false;
	}

	private pollInterval: ReturnType<typeof setInterval> | null = null;

	startPricePolling() {
		this.stopPricePolling();
		this.pollInterval = setInterval(() => {
			const coinIds = this.holdings.map((h: any) => h.coinId);
			if (coinIds.length > 0) this.fetchPrices(coinIds);
		}, 60_000);
	}

	stopPricePolling() {
		if (this.pollInterval) {
			clearInterval(this.pollInterval);
			this.pollInterval = null;
		}
	}
}

export const portfolio = new PortfolioStore();
