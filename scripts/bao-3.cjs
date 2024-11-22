#!/usr/bin/env node
const fs = require('fs/promises');
const { Command } = require('commander');
const { twilio } = require('../utils/twilio.cjs');
const { wrangler } = require('./utils/wrangler.cjs');
const { flattenBody } = require('./utils');

const program = new Command();

// interface FlowerPerson {
//   phone_number: string;
//   flower_id: string;
//   follow_up?: string;
// }

// interface MessageTemplate {
//   template: string;
//   flowerUrl: string;
// }

async function generateMessages(numbersPath, outputPath, numbers) {
	try {
		const data = [];
		const numbers = JSON.parse(await fs.readFile(numbersPath, 'utf-8'));
		console.log(numbers);
		return;
		for (const phoneNumber of numbers) {
			const res = await fetch(
				'https://instabao-be.pages.dev/messages/generate-message?id=' + phoneNumber
			);
			const generatedMessage = await res.text();

			const message = `${generatedMessage}. https://rsv.yaytso.art`;

			data.push({
				phone_number: phoneNumber,
				follow_up: message
			});

			console.log(`Generated for ${phoneNumber}:\n${message}\n`);
		}

		await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
		console.log(`Saved ${data.length} messages to ${outputPath}`);
	} catch (error) {
		console.error('Failed to generate messages:', error);
		process.exit(1);
	}
}

async function sendMessages(dataPath, testMode = false) {
	try {
		const { memSave, memFetch } = wrangler();
		const { sendSms } = twilio();

		const flowerPeople = JSON.parse(await fs.readFile(dataPath, 'utf-8'));

		for (const person of flowerPeople) {
			const { phone_number, follow_up } = person;
			if (!follow_up) continue;

			// const friend = phoneToFriend[phone_number];
			const friend = null;
			const number = testMode ? '14159671642' : phone_number;

			try {
				// Get history
				const historyKey = `history:postlos2:${number.replace('+', '')}`;
				let history = [];
				try {
					const historyString = await memFetch(historyKey);
					history = JSON.parse(historyString);
				} catch {
					console.log(`No history found for ${number}`);
				}

				// Add new message
				const newMessage = {
					content: flattenBody(follow_up),
					role: 'assistant'
				};
				history.push(newMessage);

				if (!testMode) {
					await sendSms(flattenBody(follow_up), number);
					console.log(`Message sent to ${number}`);
				} else {
					console.log(`Test mode: Would send to ${number}:\n${follow_up}`);
				}

				await memSave(historyKey, JSON.stringify(history).replace(/'/g, ''));
				console.log(`History saved for ${number} (${friend || 'unknown'})`);
			} catch (error) {
				console.error(`Failed processing ${number}:`, error);
			}

			console.log('------\n');
		}
	} catch (error) {
		console.error('Failed to send messages:', error);
		process.exit(1);
	}
}

program.name('message-cli').description('Generate and send messages');

program
	.command('generate')
	.description('Generate messages from templates')
	.option('-n, --numbers <path>', 'Path to numbers JSON', './numbers.json')
	.option('-t, --templates <path>', 'Path to templates JSON', './templates.json')
	.option('-o, --output <path>', 'Output path for generated messages', './flower_people.json')
	.action((options) => {
		generateMessages(options.numbers, options.templates, options.output);
	});

program
	.command('send')
	.description('Send generated messages')
	.option('-d, --data <path>', 'Path to message data', './flower_people.json')
	.option('-t, --test', 'Run in test mode (no actual sends)', false)
	.action((options) => {
		sendMessages(options.data, options.test);
	});

program.parse();
