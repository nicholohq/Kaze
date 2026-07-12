import { json } from '@sveltejs/kit';
import { getEthBalance, getTokenBalances } from '$lib/server/alchemy.js';

export async function POST({ request }: { request: Request }) {
	const { address } = await request.json();

	if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
		return json({ error: 'Invalid Ethereum address.' }, { status: 400 });
	}

	try {
		const [ethBalance, tokens] = await Promise.all([
			getEthBalance(address),
			getTokenBalances(address)
		]);
		return json({ address, ethBalance, tokens });
	} catch (err: any) {
		return json({ error: err.message }, { status: 502 });
	}
}
