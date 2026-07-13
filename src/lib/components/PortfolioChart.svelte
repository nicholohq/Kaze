<script lang="ts">
	import { onDestroy } from 'svelte';
	import { portfolio } from '$lib/stores/portfolio.svelte.js';
	import { createChart, type IChartApi, type ISeriesApi } from 'lightweight-charts';

	let chartContainer: HTMLDivElement;
	let chart: IChartApi | undefined;
	let series: ISeriesApi<'Line'> | undefined;

	let timeframes = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];
	let activeTF = $state('1W');

	function generateMockData(days: number) {
		const baseValue = portfolio.totalValue > 0 ? portfolio.totalValue : 10000;
		const data: { time: string; value: number }[] = [];
		let val = baseValue;
		const now = new Date();
		for (let i = days; i >= 0; i--) {
			const d = new Date(now);
			d.setDate(d.getDate() - i);
			val *= 1 + (Math.random() - 0.48) * 0.05;
			data.push({
				time: d.toISOString().split('T')[0],
				value: Math.round(val * 100) / 100
			});
		}
		return data;
	}

	let hasHoldings = $derived(portfolio.holdings.length > 0);

	function initChart() {
		if (chart) return;
		chart = createChart(chartContainer, {
			width: chartContainer.clientWidth,
			height: 300,
			layout: {
				background: { color: '#ffffff' },
				textColor: '#2c2c2c'
			},
			grid: {
				vertLines: { color: '#ece4d6' },
				horzLines: { color: '#ece4d6' }
			},
			crosshair: {
				vertLine: { color: '#c5a059', width: 1, style: 2 },
				horzLine: { color: '#c5a059', width: 1, style: 2 }
			},
			rightPriceScale: { borderColor: '#2c2c2c' },
			timeScale: { borderColor: '#2c2c2c', timeVisible: true }
		});

		series = chart.addLineSeries({
			color: '#1a2a3a',
			lineWidth: 2,
			crosshairMarkerVisible: true,
			priceFormat: { type: 'price', precision: 2, minMove: 0.01 }
		});

		const observer = new ResizeObserver(() => {
			chart?.applyOptions({ width: chartContainer.clientWidth });
		});
		observer.observe(chartContainer);

		onDestroy(() => {
			observer.disconnect();
			chart?.remove();
		});
	}

	$effect(() => {
		if (!hasHoldings || !chartContainer) return;
		initChart();
	});

	$effect(() => {
		if (!hasHoldings || !series) return;
		const days = activeTF === '1D' ? 1 : activeTF === '1W' ? 7 : activeTF === '1M' ? 30 : activeTF === '3M' ? 90 : activeTF === '1Y' ? 365 : 730;
		series.setData(generateMockData(days));
		chart?.timeScale().fitContent();
	});
</script>

<div class="chart-section panel">
	<div class="header">
		<h2>Portfolio Value</h2>
		{#if hasHoldings}
			<div class="timeframes">
				{#each timeframes as tf}
					<button
						class="tf-btn"
						class:active={activeTF === tf}
						onclick={() => activeTF = tf}
					>{tf}</button>
				{/each}
			</div>
		{/if}
	</div>
	{#if hasHoldings}
		<div bind:this={chartContainer} class="chart-container"></div>
	{:else}
		<div class="chart-placeholder">
			<svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="var(--wave-mid)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M4 36 C12 22, 18 16, 26 20 C34 24, 40 12, 44 14" />
				<circle cx="4" cy="36" r="2" fill="var(--wave-mid)" stroke="none" />
				<circle cx="26" cy="20" r="2" fill="var(--wave-mid)" stroke="none" />
				<circle cx="44" cy="14" r="2" fill="var(--wave-mid)" stroke="none" />
			</svg>
			<p>Import a wallet or add holdings to see your portfolio chart</p>
		</div>
	{/if}
</div>

<style>
	.chart-section { padding: var(--s4); }
	.header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--s3); flex-wrap: wrap; gap: var(--s2); }
	h2 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: var(--wave-mid); }
	.timeframes { display: flex; gap: var(--s1); }
	.tf-btn { font-family: var(--gothic); font-size: 0.75rem; padding: 2px var(--s2); border: 2px solid var(--charcoal); border-radius: 4px; background: var(--paper); cursor: pointer; transition: background var(--ease); }
	.tf-btn.active { background: var(--wave-deep); color: var(--wave-foam); }
	.tf-btn:hover:not(.active) { background: var(--linen-2); }
	.chart-container { width: 100%; }
	.chart-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--s3); padding: var(--s6) var(--s4); color: var(--wave-mid); text-align: center; }
	.chart-placeholder p { font-size: 0.88rem; max-width: 280px; line-height: 1.5; }
</style>
