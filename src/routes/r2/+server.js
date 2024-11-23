import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({platform}) {
    console.log('what')
    const allR2 = await platform?.env.STORAGE.list();
    return json(allR2);
};