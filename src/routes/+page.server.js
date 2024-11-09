import events from '$lib/stores/events';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, platform }) {
	const token = cookies.get('token');

	let authorized = false;
	let user = { phoneNumber: '' };
	if (token) {
		try {
			const r = await platform?.env.AUTH_SERVICE.authorizeToken(token);
			if (r.phoneNumber) {
				authorized = true;
				user = {phoneNumber: r.phoneNumber};
			}
		} finally {
            // @ts-ignore
			// r[Symbol.dispose]();
		}
	}
	const eventName = 'bao3'
	return { authorized, user, event: events[eventName] };
}
