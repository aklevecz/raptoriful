import PhoneCipher from '$lib/phone-cipher';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    const cipher = new PhoneCipher();
    const encrypted = cipher.encrypt('16266763284');
    return new Response(encrypted);
};