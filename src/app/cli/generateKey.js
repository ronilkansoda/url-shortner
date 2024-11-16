import crypto from 'crypto'
export const runtime = "nodejs"

export default async function generateKey() {
    return crypto.randomBytes(16).toString("hex")
}
console.log(generateKey())
// generateKey().then(x=>console.log(x))