import { Alchemy, Network } from 'alchemy-sdk';

export interface TokenBalance {
	contractAddress: string | null;
	symbol: string;
	name: string;
	logo: string | null;
	balance: string;
	decimals: number;
}

let _alchemy: Alchemy | null = null;

function getAlchemy() {
	if (!_alchemy) {
		const key = process.env.ALCHEMY_API_KEY;
		if (!key) throw new Error('ALCHEMY_API_KEY environment variable is required');
		_alchemy = new Alchemy({ apiKey: key, network: Network.ETH_MAINNET });
	}
	return _alchemy;
}

export async function getEthBalance(address: string): Promise<string> {
	const balance = await getAlchemy().core.getBalance(address);
	return balance.toString();
}

export async function getTokenBalances(address: string): Promise<TokenBalance[]> {
	const balances = await getAlchemy().core.getTokenBalances(address);
	const tokens: TokenBalance[] = [];

	const metadataPromises = balances.tokenBalances
		.filter(t => t.tokenBalance !== '0')
		.map(async (token) => {
			try {
				const metadata = await getAlchemy().core.getTokenMetadata(token.contractAddress);
				return {
					contractAddress: token.contractAddress,
					symbol: metadata.symbol || 'UNKNOWN',
					name: metadata.name || 'Unknown Token',
					logo: metadata.logo || null,
					balance: token.tokenBalance,
					decimals: metadata.decimals || 18
				};
			} catch {
				return null;
			}
		});

	const results = await Promise.all(metadataPromises);
	for (const r of results) {
		if (r) tokens.push(r);
	}

	return tokens;
}
