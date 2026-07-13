<script lang="ts">
</script>

<div class="loader">
	<div class="loader-mark">
		<div class="loader-ring"></div>
		<div class="loader-wave">
			<svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="var(--vermilion)" stroke-width="2" stroke-linecap="round">
				<path class="wave-path" d="M4 28 C10 18, 14 14, 20 16 C26 18, 30 14, 36 20" />
			</svg>
		</div>
	</div>
	<div class="loader-kanji">風</div>
	<div class="loader-text">KAZE</div>
</div>

<style>
	.loader {
		position: fixed; inset: 0; z-index: 100000;
		background: var(--wave-deep);
		display: flex; flex-direction: column; align-items: center; justify-content: center;
		gap: 1.2rem;
		transition: opacity .6s ease, visibility .6s ease;
	}
	.loader-mark { position: relative; width: 90px; height: 90px; display: grid; place-items: center; }
	.loader-ring {
		position: absolute; inset: 0;
		border: 4px solid var(--vermilion); border-radius: 50%;
		border-top-color: transparent; border-right-color: transparent;
		animation: spin 1s linear infinite;
	}
	.loader-wave { position: relative; animation: pulse 1.4s ease-in-out infinite; }

	.wave-path {
		stroke-dasharray: 60;
		stroke-dashoffset: 0;
		animation: wave-draw 2s ease-in-out infinite;
	}

	.loader-kanji {
		font-family: var(--serif); font-size: 3rem; color: var(--gold);
		animation: pulse 1.4s ease-in-out infinite;
	}
	.loader-text { font-family: var(--serif); color: var(--gold); letter-spacing: 3px; font-size: .9rem; }

	@keyframes spin { to { transform: rotate(360deg); } }
	@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
	@keyframes wave-draw {
		0% { stroke-dashoffset: 60; }
		50% { stroke-dashoffset: 0; }
		100% { stroke-dashoffset: 60; }
	}
</style>
