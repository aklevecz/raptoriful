import { readFileSync } from 'fs';

export function loadEnv() {
    try {
        const env = readFileSync('.env', 'utf8')
            .split('\n')
            .filter(line => line.trim() && !line.startsWith('#'))
            .reduce((acc, line) => {
                const [key, ...valueParts] = line.split('=');
                acc[key.trim()] = valueParts.join('=').trim().replace(/^['"]|['"]$/g, '');
                return acc;
            }, {});

        // Add variables to process.env
        Object.assign(process.env, env);
        
        return env;
    } catch (error) {
        console.error('Error loading .env file:', error);
        return {};
    }
}

const env = loadEnv();

function twilio() {
	const accountSid = env.TWILIO_ACCOUNT_SID;
	const authToken = env.TWILIO_API_TOKEN;
	const verificationSid = 'VAd220707c0f7ded7a3c70a329de6b5377'

	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`)
	}

	function cleanNumber(number) {
		if (number.startsWith('+') && number.length === 12) {
			return number 
		}
		let cleanedNumber = number

		if (!number.startsWith('1')) {
			cleanedNumber = `1${cleanedNumber}`;
		}
		if (!number.startsWith('+')) {
			cleanedNumber = `+${cleanedNumber}`;
		}
		return cleanedNumber
	}

	function sendSms(body, to, mediaUrl) {
		let number = cleanNumber(to);
		const messageConfig = {
			Body: body,
			To:number,
			From: '+13239876321',
		};
		if (mediaUrl) {
			messageConfig.mediaUrl = mediaUrl;
		}
		const url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json";
		const data = new URLSearchParams(messageConfig);
		return fetch(url, {
		  method: "POST",
		  headers,
		  body: data,
		}).then(r => r.text()).then(console.log).catch(console.error);
	}

	return {cleanNumber, sendSms,
	    sendVerification: async (phoneNumber) => {
			const url = `https://verify.twilio.com/v2/Services/${verificationSid}/Verifications`;
			const body = new URLSearchParams({
			  'To': phoneNumber,
			  'Channel': 'sms'
			}).toString();
			const response = await fetch(url, { method: 'POST', headers, body });
			return response.json();
		  },
		
		  checkVerification: async (phoneNumber, otpCode) => {
			const url = `https://verify.twilio.com/v2/Services/${verificationSid}/VerificationCheck`;
			const body = new URLSearchParams({
			  'To': phoneNumber,
			  'Code': otpCode
			}).toString();
		
			const response = await fetch(url, { method: 'POST', headers, body });
			return response.json();
		  }
	
	};
}

module.exports = { twilio };
