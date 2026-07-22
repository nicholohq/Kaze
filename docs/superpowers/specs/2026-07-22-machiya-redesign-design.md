# Kaze — Machiya Redesign

## Overview

Redesign Kaze's visual identity from "Great Wave off Kanagawa" to "Machiya Townhouse" — replacing ocean/wave motifs with traditional Japanese townhouse architecture. Surface-level redesign: same layout, same components, same design system DNA (hard borders, offset shadows, hanko seals, kanji titles). Only the visual skin changes.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| House style | Machiya Townhouse | Intimate, urban, warm — lattice windows translate beautifully to digital grids |
| Color palette | Warm Earth Tones | Authentic machiya materials (wood, straw, paper, charcoal) |
| Design system | Evolve Existing | Keep hard borders, offset shadows, vermilion accents — swap motifs only |
| Hero treatment | AI-generated machiya illustration | Directly replaces greatwave.jpg, same usage pattern |
| Patterns | Lattice + Shoji + Tatami + Tokonoma | Full machiya vocabulary across all surfaces |

## Color Palette

### Updated Tokens

| Token | Old | New | Material |
|-------|-----|-----|----------|
| `--wave-deep` | `#1a2a3a` | `#2c1e12` | Dark wood (moya) |
| `--wave-mid` | `#2c4a6a` | `#6b5744` | Aged timber |
| `--wave-foam` | `#e8f0f8` | `#f5efe4` | Warm paper (washi) |
| `--wave-spray` | `#f5f0e8` | `#e8dfd0` | Straw (tatami) |
| `--vermilion` | `#c41a1a` | `#c41a1a` | Lacquer red (keep) |
| `--gold` | `#c5a059` | `#c5a059` | Brass lantern (keep) |
| `--linen` | `#f5f0e8` | `#f0e8d8` | Warm linen |
| `--paper` | `#ffffff` | `#faf6ee` | Warm white (shoji) |
| `--charcoal` | `#2c2c2c` | `#2c2218` | Warm charcoal |
| `--ink` | `#1a1a1a` | `#1c1610` | Sumi ink (warmer) |

### New Tokens

| Token | Value | Material |
|-------|-------|----------|
| `--koshi` | `#5a3e28` | Lattice wood brown |
| `--tatami` | `#c8b88a` | Tatami mat surface |
| `--shoji` | `#f5f0e4` | Translucent paper |
| `--engawa` | `#8b7355` | Veranda wood |

### Unchanged Tokens

Seasonal gradients, matcha, crimson, sakura, fuji, beni, spacing scale, typography.

## Patterns

1. **Koshi Lattice (格子)** — Vertical wooden bars with narrow gaps. Replaces seigaiha in nav, dashboard hero, dividers.
2. **Shoji Screen (障子)** — Grid of rectangular paper panels with thin wood frames. Backgrounds and card surfaces.
3. **Tatami Weave (畳)** — Horizontal fiber herringbone texture. Card/section backgrounds.
4. **Tokonoma Alcove (床の間)** — Recessed, framed layout treatment for featured sections.

## Pages

- **Landing:** Machiya illustration hero, tokonoma feature cards, koshi bg pattern
- **Login:** Machiya illustration full-screen bg, lattice icon, warm card
- **Dashboard:** Koshi pattern hero, warm shadows, tatami panel textures
- **Settings:** KoshiBanner replaces GreatWaveArt
- **Nav:** Dark wood bg + koshi overlay, lattice brand icon
- **Loader:** Lattice draw animation, warm bg

## Components

- `GreatWaveArt.svelte` → rename to `KoshiBanner.svelte` (lattice SVG strip)
- `SeigaihaPattern.svelte` → replace with `KoshiPattern.svelte`
- `JapanesePattern.svelte` → add koshi, shoji, tatami types
- Update all page-level and component color references

## Assets

- `static/machiya.jpg` — AI-generated machiya townhouse illustration
- `static/greatwave.jpg` — removed
