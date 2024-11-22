/** @type {import('./$types').RequestHandler} */
export async function GET({platform, url}) {
    const id = url.searchParams.get('id')
    
    try {
        if (id?.includes("_thumb")) {
            const key = `${id.replace("_thumb", "")}:favorite:b3:base64`
            const base64String = await platform?.env.BAO_GEN.get(key);
            if (!base64String) {
                return new Response('Image not found', { status: 404 });
            }
            const binaryString = atob(base64String);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            return new Response(bytes, {
                headers: {
                    'Content-Type': 'image/jpeg',
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            });
        }

        // IS THIS BEING USED?
        const storage = platform?.env.STORAGE;
        if (!storage) {
            return new Response('Storage not configured', { status: 500 });
        }

        const object = await storage.get(`bao3/rsvp/${id}`);
        
        if (!object) {
            return new Response('Image not found', { status: 404 });
        }

        // Debug log to see what content type we're getting from R2
        console.log('R2 Content Type:', object.httpMetadata?.contentType);

        // Explicitly set image/png since we know these are PNG files
        const contentType = 'image/jpeg';

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