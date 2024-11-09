/** @type {import('./$types').RequestHandler} */
export async function GET({platform, url}) {
    const id = url.searchParams.get('id')
    
    try {
        const storage = platform?.env.STORAGE;
        if (!storage) {
            return new Response('Storage not configured', { status: 500 });
        }

        const object = await storage.get(`bao3/rsvp/${id}.png`);
        
        if (!object) {
            return new Response('Image not found', { status: 404 });
        }

        // Debug log to see what content type we're getting from R2
        console.log('R2 Content Type:', object.httpMetadata?.contentType);

        // Explicitly set image/png since we know these are PNG files
        const contentType = 'image/png';

        return new Response(await object.arrayBuffer(), {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600',
                'ETag': object.httpEtag,
                'Content-Disposition': 'inline'
            }
        });
    } catch (error) {
        console.error('Error retrieving image:', error);
        return new Response('Error retrieving image', { status: 500 });
    }
}