import { redirect } from '@sveltejs/kit';

export function load({ locals }: { locals: any }) {
	if (!locals.user) {
		redirect(302, '/login');
	}
}
