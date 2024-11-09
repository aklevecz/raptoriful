// import { SACRET } from "$env/static/private";
const SACRET="SACRETSACRETSACRETSACRETSACRETSACRETSACRETSACRETSACRET"
var algorithm = { name: 'HMAC', hash: 'SHA-256' };

// @ts-ignore
export var getCryptoKey = async (secret) => {
    const secretBuf = typeof secret === 'string' ? new TextEncoder().encode(secret) : secret;
    return await crypto.subtle.importKey('raw', secretBuf, algorithm, false, ['sign', 'verify']);
};

// @ts-ignore
var verifySignature = async (base64Signature, value, secret) => {
    try {
        const signatureBinStr = atob(base64Signature);
        const signature = new Uint8Array(signatureBinStr.length);
        for (let i = 0; i < signatureBinStr.length; i++) signature[i] = signatureBinStr.charCodeAt(i);

        return await crypto.subtle.verify(algorithm, secret, signature, new TextEncoder().encode(value));
    } catch (e) {
        console.error(e);
        return false;
    }
};

/**
 * 
 * @param {string} jwt 
 * @returns {Promise<{phoneNumber: string}>} payload
 *  */
export var verifyAndDecodeJwt = async (jwt) => {
    const parts = jwt.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    const message = `${encodedHeader}.${encodedPayload}`;
    let key = await getCryptoKey(SACRET);
    const isValid = await verifySignature(signature, message, key);

    if (!isValid) {
        throw new Error('Invalid signature');
    }

    const payload = JSON.parse(atob(encodedPayload));

    return payload;
};