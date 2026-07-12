<script lang="ts">
	let { data = [], width = 80, height = 24, color = 'var(--matcha)' }: {
		data?: number[];
		width?: number;
		height?: number;
		color?: string;
	} = $props();

	let path = $derived.by(() => {
		if (data.length < 2) return '';
		const min = Math.min(...data);
		const max = Math.max(...data);
		const range = max - min || 1;
		const w = width - 2;
		const h = height - 2;
		return data.map((v, i) => {
			const x = 1 + (i / (data.length - 1)) * w;
			const y = 1 + ((max - v) / range) * h;
			return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
		}).join(' ');
	});
</script>

<svg {width} {height} viewBox="0 0 {width} {height}" class="sparkline">
	<path d={path} fill="none" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>

<style>
	.sparkline { display: inline-block; vertical-align: middle; }
</style>
