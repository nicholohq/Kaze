<script lang="ts" module>
	// Unique-id counter so multiple pattern instances don't collide on <pattern> ids.
	let uid = 0;
</script>

<script lang="ts">
	// Background pattern system. Renders a tiling SVG (or CSS washi) as a
	// non-interactive decorative layer. Drop inside a position:relative parent.
	type Pattern = 'asanoha' | 'seigaiha' | 'yagasuri' | 'washi' | 'koshi' | 'shoji' | 'tatami';

	let {
		pattern = 'seigaiha',
		opacity = 0.08,
		color = 'currentColor',
		scale = 60,
		class: className = ''
	}: {
		pattern?: Pattern;
		opacity?: number;
		color?: string;
		scale?: number;
		class?: string;
	} = $props();

	const n = uid++; // stable per-instance suffix so <pattern> ids never collide
	const id = $derived(`jp-${pattern}-${n}`);
</script>

<div
	class="jp-pattern {className}"
	class:washi={pattern === 'washi'}
	style="opacity:{opacity};color:{color};"
	aria-hidden="true"
>
	{#if pattern === 'washi'}
		<div class="jp-pattern washi {className}" style="opacity:{opacity};" aria-hidden="true"></div>
	{:else if pattern === 'koshi'}
		<div class="jp-pattern {className}" style="opacity:{opacity};color:{color};" aria-hidden="true">
			<svg width="100%" height="100%">
				<defs>
					<pattern {id} width={scale} height={scale * 2} patternUnits="userSpaceOnUse">
						<g fill="none" stroke="currentColor" stroke-width="2" transform="scale({scale / 60})">
							<rect x="2" y="0" width="8" height="120" opacity="0.3" />
							<rect x="16" y="0" width="4" height="120" opacity="0.18" />
							<rect x="26" y="0" width="6" height="120" opacity="0.24" />
							<rect x="38" y="0" width="3" height="120" opacity="0.15" />
							<rect x="46" y="0" width="7" height="120" opacity="0.22" />
							<rect x="56" y="0" width="5" height="120" opacity="0.16" />
						</g>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#{id})" />
			</svg>
		</div>
	{:else if pattern === 'shoji'}
		<div class="jp-pattern {className}" style="opacity:{opacity};color:{color};" aria-hidden="true">
			<svg width="100%" height="100%">
				<defs>
					<pattern {id} width={scale} height={scale} patternUnits="userSpaceOnUse">
						<g fill="none" stroke="currentColor" stroke-width="1.5" transform="scale({scale / 60})">
							<rect x="1" y="1" width="28" height="28" rx="1" opacity="0.4" />
							<rect x="31" y="1" width="28" height="28" rx="1" opacity="0.4" />
							<rect x="1" y="31" width="28" height="28" rx="1" opacity="0.4" />
							<rect x="31" y="31" width="28" height="28" rx="1" opacity="0.4" />
							<rect x="4" y="4" width="22" height="22" rx="1" opacity="0.15" fill="currentColor" />
							<rect x="34" y="4" width="22" height="22" rx="1" opacity="0.15" fill="currentColor" />
							<rect x="4" y="34" width="22" height="22" rx="1" opacity="0.15" fill="currentColor" />
							<rect x="34" y="34" width="22" height="22" rx="1" opacity="0.15" fill="currentColor" />
						</g>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#{id})" />
			</svg>
		</div>
	{:else if pattern === 'tatami'}
		<div class="jp-pattern {className}" style="opacity:{opacity};color:{color};" aria-hidden="true">
			<svg width="100%" height="100%">
				<defs>
					<pattern {id} width={scale} height={scale} patternUnits="userSpaceOnUse">
						<g fill="none" stroke="currentColor" stroke-width="1" transform="scale({scale / 40})">
							<path d="M0 4 L40 0 M0 12 L40 8 M0 20 L40 16 M0 28 L40 24 M0 36 L40 32" opacity="0.12" />
							<path d="M0 6 L40 2 M0 14 L40 10 M0 22 L40 18 M0 30 L40 26 M0 38 L40 34" opacity="0.08" />
							<line x1="0" y1="0" x2="0" y2="40" opacity="0.2" stroke-width="2" />
							<line x1="20" y1="0" x2="20" y2="40" opacity="0.2" stroke-width="2" />
							<line x1="40" y1="0" x2="40" y2="40" opacity="0.2" stroke-width="2" />
						</g>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#{id})" />
			</svg>
		</div>
	{:else}
		<div class="jp-pattern {className}" style="opacity:{opacity};color:{color};" aria-hidden="true">
			<svg width="100%" height="100%">
				<defs>
					{#if pattern === 'seigaiha'}
						<pattern {id} width={scale} height={scale / 2} patternUnits="userSpaceOnUse">
							{#each [0, scale] as cx (cx)}
								<g transform="translate({cx}, 0)">
									<circle cx="0" cy="0" r={scale * 0.33} fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
									<circle cx="0" cy="0" r={scale * 0.24} fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.7" />
									<circle cx="0" cy="0" r={scale * 0.14} fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5" />
									<circle cx="0" cy="0" r={scale * 0.05} fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.35" />
								</g>
							{/each}
							<g transform="translate({scale / 2}, 0)">
								<circle cx="0" cy="0" r={scale * 0.33} fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
								<circle cx="0" cy="0" r={scale * 0.24} fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.7" />
								<circle cx="0" cy="0" r={scale * 0.14} fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5" />
								<circle cx="0" cy="0" r={scale * 0.05} fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.35" />
							</g>
						</pattern>
					{:else if pattern === 'asanoha'}
						<pattern {id} width={scale} height={scale} patternUnits="userSpaceOnUse">
							<g fill="none" stroke="currentColor" stroke-width="1" transform="scale({scale / 60})">
								<path d="M30 0 L30 30 M30 30 L60 15 M30 30 L60 45 M30 30 L30 60 M30 30 L0 45 M30 30 L0 15" />
								<path d="M30 0 L60 15 L60 45 L30 60 L0 45 L0 15 Z" />
								<path d="M30 0 L45 7.5 M30 0 L15 7.5 M60 15 L45 22.5 M60 45 L45 37.5 M30 60 L45 52.5 M30 60 L15 52.5 M0 45 L15 37.5 M0 15 L15 22.5" />
							</g>
						</pattern>
					{:else if pattern === 'yagasuri'}
						<pattern {id} width={scale} height={scale} patternUnits="userSpaceOnUse">
							<g fill="currentColor" transform="scale({scale / 40})">
								<path d="M0 0 L20 10 L0 20 L0 14 L10 10 L0 6 Z" />
								<path d="M20 0 L40 10 L20 20 L20 14 L30 10 L20 6 Z" />
								<path d="M0 20 L20 30 L0 40 L0 34 L10 30 L0 26 Z" />
								<path d="M20 20 L40 30 L20 40 L20 34 L30 30 L20 26 Z" />
							</g>
						</pattern>
					{/if}
				</defs>
				<rect width="100%" height="100%" fill="url(#{id})" />
			</svg>
		</div>
	{/if}
</div>

<style>
	.jp-pattern {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
	}
	.jp-pattern svg {
		display: block;
	}
	.jp-pattern.washi {
		background-image:
			radial-gradient(circle at 20% 30%, rgba(139,115,85,0.5) 0, transparent 45%),
			radial-gradient(circle at 80% 70%, rgba(139,115,85,0.5) 0, transparent 45%),
			repeating-linear-gradient(0deg, rgba(28,28,28,0.35) 0 1px, transparent 1px 3px),
			repeating-linear-gradient(90deg, rgba(28,28,28,0.3) 0 1px, transparent 1px 4px);
	}
</style>
