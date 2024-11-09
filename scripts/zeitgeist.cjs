const { twilio } = require('../utils/twilio.cjs');
const { wrangler } = require('../utils/wrangler.cjs');
const { sendSms } = twilio();
const wranglerClient = wrangler();

const message = `hi! just a friendly reminder that the raptor hangout is at zeitgeist sunday may 19 at 4:20pm. let me know if you have any questions and I might answer them 😉`;
async function main() {
	const queryResults = await wranglerClient.d1Get('SELECT phone_number FROM raptor_rsvps');
	const phoneNumbers = JSON.parse(queryResults)[0].results.map((r) => r.phone_number);
	for (let phoneNumber of phoneNumbers) {
		// try {
		// 	const m = await wranglerClient.memFetch(`history:bday:${phoneNumber}`);
		// 	console.log(`history found for ${phoneNumber}:`);
		// 	console.log(m);
		// } catch (e) {
		// 	console.log(`history not found for ${phoneNumber}`);
		// }
		// sendSms(message, phoneNumber);
        await wranglerClient.memSave(`history:bday:${phoneNumber}`, JSON.stringify([{role:"user", content: message}]));
		console.log(phoneNumber);
	}
}
main();