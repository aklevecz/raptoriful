import { verifyAndDecodeJwt } from '$lib/auth.server';
import db from '$lib/db';
import PhoneCipher from '$lib/phone-cipher';
import { json } from '@sveltejs/kit';

// TODO: ADD STUFF HERE TO THE CONFIG TO MAKE LESS FLOWERS2 HARDCODED

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, url, platform }) {
	// await platform?.env.FLOWERS_KV.delete(`flowers2:rsvpSent:14159671642`)
	const eventName = url.searchParams.get('eventName');

	// all rsvps for this event name
	if (eventName) {
		const cipher = new PhoneCipher();
		const { results: rsvps } = await db.getRsvpsAndRaptors(platform?.env.DATABASE, eventName);
		return json({ success: true, rsvps: rsvps.map((/** @type {*} */r) => ({ ...r, phone_number: cipher.encrypt(r.phone_number)  })) });
	}

	// all rsvps for a given user
	const token = cookies.get('token');
	if (token) {
		try {
			const payload = await verifyAndDecodeJwt(token);

			const { results: rsvps } = await db.getRsvp(platform?.env.DATABASE, payload);
			return json({ success: true, rsvps: rsvps });
		} catch (e) {
			console.log(e);
		}
	}
	return json({ message: 'Unauthorized', status: 401 });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies, platform }) {
	const { eventName } = await request.json();
	const token = cookies.get('token');
	if (token) {
		const payload = await verifyAndDecodeJwt(token);

		try {
			await db.createRsvp(platform?.env.DATABASE, { ...payload, eventName });

			// return json({ success: true });
		} catch (e) {
			console.log(`Error saving RSVP for ${payload.phoneNumber}`);
			console.log(e);
			// return json({ success: false });
		}

		try {
			// TODO: from config
			const key = `flowers2:rsvpSent:${payload.phoneNumber}`;
			const hasReceivedInitialNotify = await platform?.env.FLOWERS_KV.get(key);
			// const dateTime = formatDate(new Date(events.flowers.date))
			const dateTime = "Saturday, June 22nd 12:00pm"
			if (!hasReceivedInitialNotify) {
				// TODO: from config
				const FLOWERS_2ND_VIEWING_RSVP_MESSAGE = `hi! you are rsvp'd for the flowers viewing ${dateTime}. here is your own flower that you will get to see in full form in the space. I'll send you a reminder but feel free to ask me any questions and I might answer them 😉`;
				
				const firstNamePh = 'noname'
				const tempHeaderAuth = {
					'z-auth': 'x-chicken-x'
				}
				const endpoint = 'https://los.baos.haus/messaging/send'
				await fetch(endpoint,
					{
						method: 'POST',
						headers: tempHeaderAuth,
						body: JSON.stringify({
							message: FLOWERS_2ND_VIEWING_RSVP_MESSAGE,
							firstName: firstNamePh,
							phoneNumber: payload.phoneNumber
						})
					}
				);
				await platform?.env.FLOWERS_KV.put(key, true);
			}
		} catch (e) {
			console.log(`Error saving notification sent for ${payload.phoneNumber}`);
			console.log(e)
		}
	}
	return json({ success: true });
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, cookies, platform }) {
	const { eventName } = await request.json();
	const token = cookies.get('token');
	if (token) {
		try {
			const payload = await verifyAndDecodeJwt(token);
			await db.deleteRsvp(platform?.env.DATABASE, { ...payload, eventName });
			return json({ success: true });
		} catch (e) {
			return json({ success: false });
		}
	}
	return json({ success: true });
}
