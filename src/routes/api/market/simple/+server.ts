import { json } from '@sveltejs/kit';
import { fetchSimplePrice } from '$lib/server/coingecko.js';

export async function GET({ url }: { url: URL }) {
	const ids = url.searchParams.get('ids');
	if (!ids) return json({ error: 'ids parameter required' }, { status: 400 });
	try {
		const prices = await fetchSimplePrice(ids.split(','));
		return json(prices);
	} catch (err: any) {
		return json({ error: err.message }, { status: 502 });
	}
}
