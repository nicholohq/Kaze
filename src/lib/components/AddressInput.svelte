<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let address = $state('');
	let error = $state('');

	const emit = createEventDispatcher<{ connected: { address: string } }>();

	function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		const addr = address.trim();
		if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
			error = 'Invalid Ethereum address (must be 0x followed by 40 hex characters)';
			return;
		}
		emit('connected', { address: addr });
	}
</script>

<form onsubmit={handleSubmit} class="address-input">
	<input
		class="input"
		placeholder="0x... paste Ethereum address"
		bind:value={address}
	/>
	<button type="submit" class="btn">Import</button>
	{#if error}
		<p class="error">{error}</p>
	{/if}
</form>

<style>
	.address-input { display: flex; gap: var(--s2); flex-wrap: wrap; }
	.address-input .input { flex: 1; min-width: 200px; }
	.error { color: var(--crimson); font-size: 0.82rem; width: 100%; }
</style>
