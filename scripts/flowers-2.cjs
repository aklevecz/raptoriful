const { twilio } = require('../utils/twilio.cjs');
const { wrangler } = require('../utils/wrangler.cjs');
const { sendSms } = twilio();
const wranglerClient = wrangler();
const meNumber = '14159671642'
// const message = `hi! just a friendly reminder that the raptor hangout is at zeitgeist sunday may 19 at 4:20pm. let me know if you have any questions and I might answer them 😉`;
async function main() {
	const queryResults = await wranglerClient.d1Get(`SELECT phone_number FROM raptor_rsvps WHERE event_name='flowers'`);
	const people = JSON.parse(queryResults)[0].results.map((r) => ({phoneNumber:r.phone_number, firstName: r.first_name}));
	for (let {phoneNumber, firstName} of people) {

		// if (phoneNumber===meNumber) continue

		console.log(phoneNumber)
		const message = `hi! excited to see you this afternoon.

		some deets: Starting at 12pm, you are welcome to go straight into the vision pro, or hang out with a drink and some za.

		the address is 2684 Lacy St. 90031 #109 (map:https://yaytso.art/deets). you can buzz my dad, or call him, and he should let you in. don't ask me to let you in because I'm a dog and will probably mess with you.

		parking is usually plentiful, so no need to stress there. there is also a metro stop super close if you have heard of that thing.

		Lacy Lofts is inhabited by humans who work and live here. the common area with the koi pond and picnic tables always welcome good company, but just treat the space like your own home 🌸:)`
		let messages = []
		try {
			const m = await wranglerClient.memFetch(`history:bday:${phoneNumber}`);
			console.log(`history found for ${phoneNumber}:`);
			messages = JSON.parse(m)
		} catch (e) {
			console.log(`history not found for ${phoneNumber}`);
		}
		const singleLineMessage = message.replace(/\n\s+/g, ' ')
		const newMessage = {role:"assistant", content:singleLineMessage}
		messages.push(newMessage)

		const escapedMessages = JSON.stringify(messages).replace(/"/g, '\\"')
		await sendSms(message, phoneNumber);
        await wranglerClient.memSave(`history:bday:${phoneNumber}`, escapedMessages);
		console.log(phoneNumber, firstName);
		
	}
}
main();