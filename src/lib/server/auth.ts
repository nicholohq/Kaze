import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const TOKEN_EXPIRY = '7d';
const SALT_ROUNDS = 10;

function getSecret(): string {
	const secret = process.env.JWT_SECRET;
	if (!secret) throw new Error('JWT_SECRET environment variable is required');
	return secret;
}

export function hashPassword(password: string): string {
	return bcrypt.hashSync(password, SALT_ROUNDS);
}

export function verifyPassword(password: string, hash: string): boolean {
	return bcrypt.compareSync(password, hash);
}

export function createToken(user: { id: string; username: string }): string {
	return jwt.sign(
		{ userId: user.id, username: user.username },
		getSecret(),
		{ expiresIn: TOKEN_EXPIRY }
	);
}

export function verifyToken(token: string): { userId: string; username: string } | null {
	try {
		return jwt.verify(token, getSecret()) as { userId: string; username: string };
	} catch {
		return null;
	}
}
