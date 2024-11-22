import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({cookies, platform}) {
    const token = cookies.get('token');
    if (!token) {
        throw new Error('No authentication token provided');
    }

    const { phoneNumber } = await platform?.env.AUTH_SERVICE.authorizeToken(token);
    if (!phoneNumber) {
        throw new Error('Invalid authentication payload');
    }

    const favorites = await platform?.env.BAO_GEN.get(`${phoneNumber}:favorites:b3`);

    return json({ success: true, favorites });
};

export async function DELETE({request, cookies, platform}) {
    const { id } = await request.json();
    if (!id) {
        return json({ error: 'No ID provided' }, { status: 400 });
    }

    const token = cookies.get('token');
    if (!token) {
        throw new Error('No authentication token provided');
    }

    const { phoneNumber } = await platform?.env.AUTH_SERVICE.authorizeToken(token);
    if (!phoneNumber) {
        throw new Error('Invalid authentication payload');
    }

    const currentFavorites = await platform?.env.BAO_GEN.get(`${phoneNumber}:favorites:b3`);

    if (currentFavorites) {
        const favorites = JSON.parse(currentFavorites);
        console.log(id)
        console.log('favorites', favorites)
        const newFavorites = favorites.filter((/** @type {*} */ favorite) => favorite !== id);
        await platform?.env.BAO_GEN.put(`${phoneNumber}:favorites:b3`, JSON.stringify(newFavorites));
        console.log('newFavorites', newFavorites)
    }

    return json({ success: true });
};