import * as jose from "jose"

const secret = jose.base64url.decode(process.env.JOSE_SESSION_KEY)
const issuer = 'urn:example:issuer'
const audience = 'urn:example:audience'
const expiresAt = '10s'

export const encodeUserSession = async (userId) => {
    const jwt = await new jose.EncryptJWT({ 'user': userId })
        .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
        .setIssuedAt()
        .setIssuer(issuer)
        .setAudience(audience)
        .setExpirationTime(expiresAt)
        .encrypt(secret)
    return jwt
}

export const decodeUserSession = async (jwt) => {
    try {
        const { payload } = await jose.jwtDecrypt(jwt, secret, {
            issuer: issuer,
            audience: audience,
        })
        const { user } = payload
        return user
    } catch (error) {

    }
    return null
}

async function verifySes() {
    const userId = "1"
    const jwtToken = await encodeUserSession(userId)
    const user = await decodeUserSession(`${jwtToken}`)
    console.log(user, userId == user)
}

verifySes().then(x=>console.log("verify")).catch(err=>console.log(err))