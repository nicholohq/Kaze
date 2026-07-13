import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db.js';
import { verifyPassword, createToken } from '$lib/server/auth.js';

export async function POST({ cookies, request }: { cookies: any; request: Request }) {
	const { username, password } = await request.json();
	if (!username || !password) {
		return json({ error: 'Username and password are required.' }, { status: 400 });
	}

	const db = getDb();
	const result = await db.execute({
		sql: 'SELECT * FROM users WHERE username = ?',
		args: [username]
	});

	if (result.rows.length === 0) {
		return json({ error: 'Invalid username or password.' }, { status: 401 });
	}

	const user = result.rows[0] as any;
	if (!verifyPassword(password, user.password_hash)) {
		return json({ error: 'Invalid username or password.' }, { status: 401 });
	}

	const token = createToken({ id: user.id, username: user.username });
	cookies.set('session', token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: true,
		maxAge: 60 * 60 * 24 * 7
	});

	return json({ id: user.id, username: user.username, walletAddress: user.wallet_address || null });
}
