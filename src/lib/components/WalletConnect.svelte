<script lang="ts">
	let { onconnected }: { onconnected?: (detail: { address: string }) => void } = $props();

	let connecting = $state(false);
	let error = $state('');

	async function connectMetaMask() {
		connecting = true;
		error = '';
		try {
			const eth = (window as any).ethereum;
			if (!eth) {
				error = 'MetaMask is not installed. Paste your address manually instead.';
				return;
			}
			const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
			if (accounts.length > 0) {
				onconnected?.({ address: accounts[0] });
			}
		} catch (err: any) {
			error = err.message || 'Failed to connect wallet';
		} finally {
			connecting = false;
		}
	}
</script>

<div class="wallet-connect">
	<button class="btn btn--primary" onclick={connectMetaMask} disabled={connecting}>
		{connecting ? 'Connecting...' : 'Connect MetaMask'}
	</button>
	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>

<style>
	.wallet-connect { display: flex; flex-direction: column; gap: var(--s2); align-items: center; }
	.error { color: var(--crimson); font-size: 0.82rem; text-align: center; }
</style>
