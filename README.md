# Kaze 🌊

> **Kaze (風)** — "wind" in Japanese. In Hokusai's *The Great Wave off Kanagawa*, the wind drives the wave. Kaze helps you read the market winds to navigate your crypto portfolio.

A Japanese-themed crypto portfolio tracker built with SvelteKit + TypeScript.

## Features

- **👛 Wallet Import** — Connect MetaMask or paste any Ethereum address to auto-import token holdings via Alchemy
- **📊 Live Prices** — Real-time prices and market data from CoinGecko
- **📈 Portfolio Chart** — Interactive TradingView Lightweight Charts with multiple timeframes
- **📋 Holdings Table** — Track coins you own with live P&L calculations
- **🏆 Market Rankings** — Top 100 coins by market cap with search and sparklines
- **👀 Watchlist** — Track coins you're interested in
- **🌊 Great Wave Design** — Ukiyo-e inspired interface with the Great Wave off Kanagawa theme
- **🔐 User Accounts** — JWT auth with cloud persistence via Turso (libSQL)

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | SvelteKit + TypeScript + Svelte 5 Runes |
| Database | Turso (libSQL) |
| Auth | JWT (bcryptjs + jsonwebtoken) |
| Charts | Lightweight Charts (TradingView) |
| Prices | CoinGecko API (free, no key) |
| On-chain | Alchemy SDK |
| Wallet | MetaMask (ethers) |
| Styling | Custom CSS with Japanese design tokens |
| Deploy | Vercel |

## Getting Started

```bash
git clone https://github.com/nicholohq/-Kaze.git
cd kaze
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```
TURSO_DB_URL=libsql://kaze-nicholohq.aws-ap-northeast-1.turso.io
TURSO_AUTH_TOKEN=your_turso_token
JWT_SECRET=your_random_secret
ALCHEMY_API_KEY=your_alchemy_key
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

## Deployment

Deploy to Vercel with the environment variables above. The database schema auto-migrates on first start via `hooks.server.ts`.

## Project Structure

```
src/
├── lib/
│   ├── components/       # UI components
│   │   ├── AddressInput.svelte
│   │   ├── GreatWaveArt.svelte
│   │   ├── HoldingsTable.svelte
│   │   ├── MarketRankings.svelte
│   │   ├── Nav.svelte
│   │   ├── PortfolioChart.svelte
│   │   ├── PortfolioOverview.svelte
│   │   ├── Sparkline.svelte
│   │   ├── WalletConnect.svelte
│   │   └── Watchlist.svelte
│   ├── server/           # Server-side utilities
│   │   ├── alchemy.ts
│   │   ├── auth.ts
│   │   ├── coingecko.ts
│   │   ├── db.ts
│   │   ├── id.ts
│   │   └── migrate.ts
│   └── stores/           # Svelte 5 runes stores
│       ├── auth.svelte.ts
│       └── portfolio.svelte.ts
├── routes/
│   ├── api/
│   │   ├── auth/         # Login, signup, logout, me
│   │   ├── holdings/     # CRUD
│   │   ├── market/       # CoinGecko proxy
│   │   ├── wallet/       # Alchemy balance proxy
│   │   └── watchlist/    # CRUD
│   ├── dashboard/        # Main app
│   ├── login/            # Auth page
│   └── settings/         # User preferences
└── app.css               # Design system
```
