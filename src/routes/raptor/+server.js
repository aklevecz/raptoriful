import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, platform }) {
	const token = cookies.get('token');
	if (token) {
		try {
			const payload = await platform?.env.AUTH_SERVICE.authorizeToken(token);
			const { results } = await platform?.env.DATABASE.prepare(
				'SELECT * FROM raptors where phone_number = ?'
			)
				.bind(payload.phoneNumber)
				.all();
			const favorite = await platform?.env.BAO_GEN.get(`${payload.phoneNumber}:favorite:b3`);
			const favorites = JSON.parse((await platform?.env.BAO_GEN.get(`${payload.phoneNumber}:favorites:b3`) || '[]'))
			return json({ success: true, raptor: results[0] || {color: '#fff'}, favorite, favorites });
		} catch (e) {
			console.log(e);
		}
	}
	return json({ success: false });
}
