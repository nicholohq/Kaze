import { Alchemy, Network } from 'alchemy-sdk';

const API_KEY = process.env.ALCHEMY_API_KEY || 'demo';

export interface TokenBalance {
	contractAddress: string | null;
	symbol: string;
	name: string;
	logo: string | null;
	balance: string;
	decimals: number;
}

const settings = {
	apiKey: API_KEY,
	network: Network.ETH_MAINNET
};

export async function getEthBalance(address: string): Promise<string> {
	const alchemy = new Alchemy(settings);
	const balance = await alchemy.core.getBalance(address);
	return balance.toString();
}

export async function getTokenBalances(address: string): Promise<TokenBalance[]> {
	const alchemy = new Alchemy(settings);
	const balances = await alchemy.core.getTokenBalances(address);
	const tokens: TokenBalance[] = [];

	for (const token of balances.tokenBalances) {
		if (token.tokenBalance === '0') continue;
		try {
			const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
			tokens.push({
				contractAddress: token.contractAddress,
				symbol: metadata.symbol || 'UNKNOWN',
				name: metadata.name || 'Unknown Token',
				logo: metadata.logo || null,
				balance: token.tokenBalance,
				decimals: metadata.decimals || 18
			});
		} catch {
			// skip tokens we can't read metadata for
		}
	}

	return tokens;
}
