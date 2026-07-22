<script lang="ts">
	// 色紙 / 掛物 — traditional card surfaces.
	//  • default  — the existing brutalist panel, tuned for Japanese accents
	//  • shikishi — poem-card: gold inner rule, optional hanko seal
	//  • kakejiku — hanging-scroll: tall, top/bottom rods, centred content
	type Variant = 'default' | 'shikishi' | 'kakejiku';

	let {
		title = '',
		subtitle = '',
		showSeal = false,
		seal = '風',
		variant = 'default',
		kanji = '',
		class: className = '',
		children
	}: {
		title?: string;
		subtitle?: string;
		showSeal?: boolean;
		seal?: string;
		variant?: Variant;
		kanji?: string;
		class?: string;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<div class="jp-card jp-card--{variant} {className}">
	{#if title || showSeal}
		<div class="jp-card__head">
			<div class="jp-card__titles">
				{#if kanji}<span class="jp-card__kanji" aria-hidden="true">{kanji}</span>{/if}
				{#if title}<h3 class="jp-card__title">{title}</h3>{/if}
				{#if subtitle}<p class="jp-card__sub">{subtitle}</p>{/if}
			</div>
			{#if showSeal}
				<span class="hanko" aria-hidden="true">{seal}</span>
			{/if}
		</div>
	{/if}
	<div class="jp-card__body">
		{@render children?.()}
	</div>
</div>

<style>
	.jp-card {
		position: relative;
		background: var(--paper);
		border-radius: var(--radius);
	}

	/* default — the house brutalist panel */
	.jp-card--default {
		border: var(--border);
		box-shadow: var(--shadow);
		padding: var(--s4);
	}

	/* shikishi — gold inner rule on warm paper */
	.jp-card--shikishi {
		background: var(--kinari);
		border: var(--border-thin);
		box-shadow: var(--shadow-kirigami);
		padding: var(--s5);
	}
	.jp-card--shikishi::after {
		content: '';
		position: absolute;
		inset: var(--s2);
		border: var(--border-origami);
		border-radius: 3px;
		pointer-events: none;
		opacity: 0.6;
	}

	/* kakejiku — hanging scroll */
	.jp-card--kakejiku {
		background: var(--kinari);
		border-left: var(--border-thin);
		border-right: var(--border-thin);
		border-radius: 0;
		box-shadow: var(--shadow-emaki);
		padding: var(--s5) var(--s4);
		text-align: center;
	}
	.jp-card--kakejiku::before,
	.jp-card--kakejiku::after {
		content: '';
		position: absolute;
		left: -4px; right: -4px;
		height: 12px;
		background: var(--chabu);
		border: var(--border-thin);
	}
	.jp-card--kakejiku::before { top: -6px; }
	.jp-card--kakejiku::after { bottom: -6px; }

	.jp-card__head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--s3);
		margin-bottom: var(--s3);
	}
	.jp-card--kakejiku .jp-card__head { justify-content: center; text-align: center; }
	.jp-card__titles { min-width: 0; }
	.jp-card__kanji {
		display: block;
		font-size: 0.72rem;
		letter-spacing: 5px;
		color: var(--vermilion);
		font-weight: 700;
		margin-bottom: 0.15rem;
	}
	.jp-card__title {
		font-family: var(--serif);
		font-size: 1.1rem;
		color: var(--charcoal);
		margin: 0;
	}
	.jp-card__sub {
		font-size: 0.82rem;
		color: var(--engawa);
		margin-top: 0.15rem;
	}
	.jp-card__body { position: relative; }
</style>
