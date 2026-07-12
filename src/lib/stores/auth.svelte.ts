class AuthStore {
	user = $state<{ id: string; username: string; walletAddress: string | null } | null>(null);
	loading = $state(true);

	async check() {
		try {
			const res = await fetch('/api/auth/me');
			if (res.ok) {
				this.user = await res.json();
			}
		} catch {
			this.user = null;
		} finally {
			this.loading = false;
		}
	}

	async login(username: string, password: string) {
		const res = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});
		if (!res.ok) {
			const data = await res.json();
			throw new Error(data.error || 'Login failed');
		}
		this.user = await res.json();
	}

	async signup(username: string, password: string) {
		const res = await fetch('/api/auth/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});
		if (!res.ok) {
			const data = await res.json();
			throw new Error(data.error || 'Signup failed');
		}
		this.user = await res.json();
	}

	async logout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		this.user = null;
	}
}

export const auth = new AuthStore();
