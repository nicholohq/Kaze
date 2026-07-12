import { getDb } from './db.js';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  wallet_address TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS holdings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  coin_id TEXT NOT NULL,
  contract_address TEXT,
  amount REAL NOT NULL,
  purchase_price REAL,
  purchase_date INTEGER,
  source TEXT DEFAULT 'manual',
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS watchlists (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  coin_id TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_holdings_user ON holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_user ON watchlists(user_id);
`;

export async function migrate() {
	const db = getDb();
	await db.executeMultiple(SCHEMA);
}
