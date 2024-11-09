const { exec } = require('child_process');
function wrangler() {
	const baoMemProd = '4eff2250e78541b9918103d7ce9686cb';
	function executeWranglerCommand(command) {
		return new Promise((resolve, reject) => {
			exec(`npx wrangler ${command}`, (error, stdout, stderr) => {
				if (error) {
					reject(error);
				} else {
					resolve(stdout);
				}
			});
		});
		s;
	}

	function memFetch(key) {
		return executeWranglerCommand(`kv:key get --namespace-id=${baoMemProd} "${key}"`);
	}
	function memSave(key, value) {
		return executeWranglerCommand(`kv:key put --namespace-id=${baoMemProd} "${key}" "${value}"`);
	}

	function d1Get(query) {
		return executeWranglerCommand(`d1 execute database --remote --json --command "${query}"`);
	}

	/**
	 * I think they need to have a user object like the ones created for his opening in order to save to ltm
	 * will need to create another way for people to create user objects
	 * @param {string} message 
	 * @param {string} role 
	 * @param {string} phoneNumber 
	 * @returns 
	 */
	function ltmSave(message, role, phoneNumber) {
		const query = `INSERT INTO ltm
		(user_id, message, role, created_at)
		SELECT
		id, '${message}', '${role}', CURRENT_TIMESTAMP FROM users WHERE phone_number = '${phoneNumber.replace('+', '')}';`;
		const commandQuery = query.replace(/\n/g, '').replace(/\t/g, ' ')
		console.log(commandQuery)
		return executeWranglerCommand(`d1 execute database --command "${commandQuery}"`);
	}
	return { executeWranglerCommand, memFetch, memSave, d1Get, ltmSave };
}

module.exports = { wrangler };