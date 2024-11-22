const flowersjson = require('./flowers.json');
const PHONE_NUMBERS = [
	'14159671642',
	'13104023486',
	'16082933272',
	'15185881038',
	'17604089325',
	'18183895521',
	'18572651820',
	'14157267607',
	'19497359783',
	'16502835816',
	'13105147331',
	'18184273856',
	'18567802671',
	'14157948342',
	'13232406961',
	'19198167298',
	'14153088082',
	'16096511581',
	'15094321110',
	'15402299418',
	'17039439859',
	'14153074016',
	'19165012472',
	'16268621783',
	'16506198142',
	'13106990079',
	'14086096999',
	'16505345225',
	'12132803821',
	'18058073726',
	'13238290818',
	'18185778646',
	'16265920898',
	'16306897235',
	'16507766116',
	'12135198233',
	'12137139936',
	'15102804042',
	'19097270441',
	'19493225149'
];

const uniquePhoneNumbers = new Set(PHONE_NUMBERS);

// Add phone numbers from flowers.json
for (const entry of flowersjson) {
	if (entry.phone_number) {
		uniquePhoneNumbers.add(entry.phone_number);
	}
}
console.log(PHONE_NUMBERS.length)
console.log(uniquePhoneNumbers.size)
const fs = require('fs');
fs.writeFileSync('friend-numbers.json', JSON.stringify(Array.from(uniquePhoneNumbers)));