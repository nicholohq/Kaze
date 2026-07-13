const BASE = 'https://api.coingecko.com/api/v3';

const cache = new Map<string, { data: any; expiry: number }>();

const pendingPromises = new Map<string, Promise<any>>();

function withCache<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
	const cached = cache.get(key);
	if (cached && cached.expiry > Date.now()) {
		return Promise.resolve(cached.data as T);
	}
	const pending = pendingPromises.get(key);
	if (pending) return pending as Promise<T>;
	const promise = fn().then(data => {
		cache.set(key, { data, expiry: Date.now() + ttlMs });
		pendingPromises.delete(key);
		return data;
	}).catch(err => {
		pendingPromises.delete(key);
		throw err;
	});
	pendingPromises.set(key, promise);
	return promise;
}

export interface CoinMarketData {
	id: string;
	symbol: string;
	name: string;
	image: string;
	current_price: number;
	market_cap: number;
	market_cap_rank: number;
	price_change_percentage_24h: number;
	price_change_percentage_7d_in_currency?: number;
	sparkline_in_7d?: { price: number[] };
}

export interface CoinDetail {
	id: string;
	symbol: string;
	name: string;
	image: { large: string };
	market_data: {
		current_price: { usd: number };
		market_cap: { usd: number };
		price_change_percentage_24h: number;
		price_change_percentage_7d: number;
		sparkline_7d?: { price: number[] };
	};
}

async function fetchJson(url: string) {
	const res = await fetch(url, {
		headers: { 'Accept': 'application/json' }
	});
	if (!res.ok) {
		throw new Error(`CoinGecko API error: ${res.status}`);
	}
	return res.json();
}

export async function fetchTopCoins(perPage: number = 100): Promise<CoinMarketData[]> {
	return withCache(`top-${perPage}`, 5 * 60 * 1000, () =>
		fetchJson(
			`${BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=7d`
		) as Promise<CoinMarketData[]>
	);
}

export async function fetchCoinDetail(coinId: string): Promise<CoinDetail> {
	return withCache(`detail-${coinId}`, 5 * 60 * 1000, () =>
		fetchJson(
			`${BASE}/coins/${encodeURIComponent(coinId)}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true`
		) as Promise<CoinDetail>
	);
}

export async function fetchPriceHistory(coinId: string, days: number = 7): Promise<{ prices: [number, number][] }> {
	return withCache(`history-${coinId}-${days}`, 5 * 60 * 1000, () =>
		fetchJson(
			`${BASE}/coins/${encodeURIComponent(coinId)}/market_chart?vs_currency=usd&days=${days}`
		) as Promise<{ prices: [number, number][] }>
	);
}

export async function fetchSimplePrice(coinIds: string[]): Promise<Record<string, { usd: number; usd_24h_change?: number }>> {
	const key = coinIds.slice().sort().join(',');
	return withCache(`price-${key}`, 60 * 1000, () =>
		fetchJson(
			`${BASE}/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd&include_24hr_change=true`
		) as Promise<Record<string, { usd: number; usd_24h_change?: number }>>
	);
}
