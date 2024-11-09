const {wrangler} = require('../utils/wrangler.cjs');
async function main() {
    const client = wrangler();
    const history = await client.memFetch('history:bday:14159671642');
    console.log(history);
}
main()