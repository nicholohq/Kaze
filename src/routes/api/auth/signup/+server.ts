import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db.js';
import { hashPassword, createToken } from '$lib/server/auth.js';
import { makeId } from '$lib/server/id.js';

export async function POST({ cookies, request }: { cookies: any; request: Request }) {
	const { username, password } = await request.json();

	if (!username || !password) {
		return json({ error: 'Username and password are required.' }, { status: 400 });
	}
	if (username.length < 3) {
		return json({ error: 'Username must be at least 3 characters.' }, { status: 400 });
	}
	if (password.length < 6) {
		return json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
	}

	const db = getDb();

	const existing = await db.execute({
		sql: 'SELECT id FROM users WHERE username = ?',
		args: [username]
	});

	if (existing.rows.length > 0) {
		return json({ error: 'Username already taken.' }, { status: 409 });
	}

	const id = makeId();
	const hash = hashPassword(password);
	const now = Date.now();

	await db.execute({
		sql: 'INSERT INTO users (id, username, password_hash, created_at) VALUES (?, ?, ?, ?)',
		args: [id, username, hash, now]
	});

	const token = createToken({ id, username });
	cookies.set('session', token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: true,
		maxAge: 60 * 60 * 24 * 7
	});

	return json({ id, username, walletAddress: null });
}
