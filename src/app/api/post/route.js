import { NextResponse } from "next/server";

// export async function GET() {
//     return NextResponse.json({ items: [{ id: 1, title: "Hello ronil" }] })
// }

export async function GET() {
    return NextResponse.json({
        items: [{ id: 1, title: "Hello ronil" }],
        status: 'ok',
        message: 'API is working',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL
    });
}