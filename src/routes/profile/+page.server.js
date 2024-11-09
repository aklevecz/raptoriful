import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, platform }) {
	const token = cookies.get('token');

	let authorized = false;
	let user = {phoneNumber: ""};
	if (token) {
		const r = await platform?.env.AUTH_SERVICE.authorizeToken(token);
		if (r.phoneNumber) {
			authorized = true;
			user = {phoneNumber: r.phoneNumber};
		}
	}

    if (!authorized) {
        return redirect(302, '/');
    }

	return { authorized, user };
}
