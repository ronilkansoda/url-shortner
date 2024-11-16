import { cookies } from "next/headers";
import * as jose from "jose";

// Decoding and encoding session with JWT
const secret = jose.base64url.decode(process.env.JOSE_SESSION_KEY)
// const secret = new TextDecoder().encode(process.env.JOSE_SESSION_KEY);
const issuer = 'urn:example:issuer';
const audience = 'urn:example:audience';
const expiresAt = '20s';

export const encodeUserSession = async (userId) => {
    const jwt = await new jose.EncryptJWT({ 'user': userId })
        .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
        .setIssuedAt()
        .setIssuer(issuer)
        .setAudience(audience)
        .setExpirationTime(expiresAt)
        .encrypt(secret);
    return jwt;
};

export const decodeUserSession = async (jwt) => {
    try {
        const { payload } = await jose.jwtDecrypt(jwt, secret, {
            issuer: issuer,
            audience: audience,
        });
        const { user } = payload;
        return user;
    } catch (error) {
        return null;
    }
};

// Set session value
export const setSessionUser = async (userId) => {
    const newSessionValue = await encodeUserSession(userId);
    const cookie = await cookies(); // Get the cookies
    cookie.set("session_id", newSessionValue);
};
export const getSessionUser = async () => {
    const cookie = await cookies();  // Await the cookies() function
    const cookieSessionValue = cookie.get("session_id"); // Now use the cookies object
    if (!cookieSessionValue) {
        return null;
    }
    const extractedUserId = await decodeUserSession(cookieSessionValue.value);
    if (!extractedUserId) {
        return null;
    }
    return extractedUserId;
};


// async function verifySes() {
//     const userId = "1"
//     const jwtToken = await encodeUserSession(userId)
//     const user = await decodeUserSession(`${jwtToken}`)
//     console.log(user, userId == user)
// }

// verifySes().then(x=>console.log("verify")).catch(err=>console.log(err))