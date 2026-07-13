import { json } from '@sveltejs/kit';
import { fetchTopCoins } from '$lib/server/coingecko.js';

export async function GET({ url }: { url: URL }) {
	const perPage = Math.min(Math.max(1, Number(url.searchParams.get('per_page')) || 100), 250);
	try {
		const coins = await fetchTopCoins(perPage);
		return json(coins);
	} catch (err: any) {
		return json({ error: err.message }, { status: 502 });
	}
}
