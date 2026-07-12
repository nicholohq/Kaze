<script lang="ts">
	import { onMount } from 'svelte';
	import { createChart, type IChartApi, type ISeriesApi } from 'lightweight-charts';

	let chartContainer: HTMLDivElement;
	let chart: IChartApi;
	let series: ISeriesApi<'Line'>;

	let timeframes = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];
	let activeTF = $state('1W');

	function generateMockData(days: number) {
		const data: { time: string; value: number }[] = [];
		let val = 10000;
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

	$effect(() => {
		const days = activeTF === '1D' ? 1 : activeTF === '1W' ? 7 : activeTF === '1M' ? 30 : activeTF === '3M' ? 90 : activeTF === '1Y' ? 365 : 730;
		if (series) {
			series.setData(generateMockData(days));
			chart.timeScale().fitContent();
		}
	});

	onMount(() => {
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

		series.setData(generateMockData(7));
		chart.timeScale().fitContent();

		const observer = new ResizeObserver(() => {
			chart.applyOptions({ width: chartContainer.clientWidth });
		});
		observer.observe(chartContainer);

		return () => {
			observer.disconnect();
			chart.remove();
		};
	});
</script>

<div class="chart-section panel">
	<div class="header">
		<h2>Portfolio Value</h2>
		<div class="timeframes">
			{#each timeframes as tf}
				<button
					class="tf-btn"
					class:active={activeTF === tf}
					onclick={() => activeTF = tf}
				>{tf}</button>
			{/each}
		</div>
	</div>
	<div bind:this={chartContainer} class="chart-container"></div>
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
</style>
