export default function getDomain() {
    const protocol = process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "https" : "http";
    const domain = process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
        ? process.env.NEXT_PUBLIC_VERCEL_URL || "your-app-name.vercel.app"
        : "localhost:3000";
    return `${protocol}://${domain}`;
}


// export default function getDomain() {
//     const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

//     if (isProduction && process.env.NEXT_PUBLIC_VERCEL_URL && !process.env.NEXT_PUBLIC_VERCEL_URL.includes("localhost")) {
//         return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
//     }

//     return "http://localhost:3000";
// }
