<script lang="ts">
</script>

<div class="loader">
	<div class="loader-mark">
		<div class="loader-ring"></div>
		<div class="loader-lattice">
			<svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="var(--vermilion)" stroke-width="2" stroke-linecap="round">
				<rect class="lattice-bar" x="4" y="4" width="4" height="32" rx="1" />
				<rect class="lattice-bar" x="12" y="4" width="3" height="32" rx="1" />
				<rect class="lattice-bar" x="18" y="4" width="5" height="32" rx="1" />
				<rect class="lattice-bar" x="26" y="4" width="3" height="32" rx="1" />
				<rect class="lattice-bar" x="32" y="4" width="4" height="32" rx="1" />
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
	.loader-lattice { position: relative; animation: pulse 1.4s ease-in-out infinite; }

	.lattice-bar {
		animation: bar-draw 2s ease-in-out infinite;
		transform-origin: center;
	}
	.lattice-bar:nth-child(1) { animation-delay: 0s; }
	.lattice-bar:nth-child(2) { animation-delay: 0.15s; }
	.lattice-bar:nth-child(3) { animation-delay: 0.3s; }
	.lattice-bar:nth-child(4) { animation-delay: 0.45s; }
	.lattice-bar:nth-child(5) { animation-delay: 0.6s; }

	.loader-kanji {
		font-family: var(--serif); font-size: 3rem; color: var(--gold);
		animation: pulse 1.4s ease-in-out infinite;
	}
	.loader-text { font-family: var(--serif); color: var(--gold); letter-spacing: 3px; font-size: .9rem; }

	@keyframes spin { to { transform: rotate(360deg); } }
	@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
	@keyframes bar-draw {
		0% { opacity: 0.1; transform: scaleY(0.2); }
		50% { opacity: 1; transform: scaleY(1); }
		100% { opacity: 0.1; transform: scaleY(0.2); }
	}
</style>
