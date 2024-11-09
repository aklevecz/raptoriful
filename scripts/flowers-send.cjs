const { twilio } = require('../utils/twilio.cjs');
const { wrangler } = require('../utils/wrangler.cjs');
const { sendSms } = twilio();
const wranglerClient = wrangler();
const meNumber = '14159671642';
// const message = `hi! just a friendly reminder that the raptor hangout is at zeitgeist sunday may 19 at 4:20pm. let me know if you have any questions and I might answer them 😉`;
async function main() {
	const queryResults = await wranglerClient.d1Get(
		`SELECT phone_number, flower_id FROM flowers WHERE claimed_flower=1`
	);
	const people = JSON.parse(queryResults)[0].results.map((r) => ({
		phoneNumber: r.phone_number,
		flowerId: r.flower_id
	}));
	for (let { phoneNumber, flowerId } of people) {
		// if (phoneNumber===meNumber) continue

		console.log(phoneNumber, flowerId);
		const message = `happy friday! thanks for coming out to smell the flowers a week or two ago.

don't tell anyone else, but you were actually my favorite person to sniff-- hope to sniff you again soon. anyway, I have your little flower here, don't tell anyone else again, but yours is my favorite-- certainly the prime color palette.

my dad also added some weird tech to it that I don't understand. you can level it up with eggs and its on a chain or something? I'm not sure, you can ask him if you're curious, otherwise enjoy your trippy little blossom 🌸

https://yaytso.art/flowers/${flowerId}`;
		let messages = [];
		try {
			const m = await wranglerClient.memFetch(`history:bday:${phoneNumber}`);
			console.log(`history found for ${phoneNumber}:`);
			messages = JSON.parse(m);
		} catch (e) {
			console.log(`history not found for ${phoneNumber}`);
		}
		const singleLineMessage = message.replace(/\n\s+/g, ' ');
		const newMessage = { role: 'assistant', content: singleLineMessage };
		messages.push(newMessage);

		const escapedMessages = JSON.stringify(messages).replace(/"/g, '\\"');
		await sendSms(message, phoneNumber);
		await wranglerClient.memSave(`history:bday:${phoneNumber}`, escapedMessages);
		console.log(`fininshed with ${phoneNumber} for flower ${flowerId}`);
	}
}
main();
