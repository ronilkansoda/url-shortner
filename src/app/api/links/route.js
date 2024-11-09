import { NextResponse } from "next/server";

export async function POST(req) {
    const contentType = await req.headers.get("content-type");
    if (contentType != "application/json") {
        return NextResponse.json({ "error": "Invalid request" }, { status: 400 })
    }
    const data = await req.json();
    return NextResponse.json(data, { status: 201 })
}