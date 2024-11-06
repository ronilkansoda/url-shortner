import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ Name: "Ronil" })
}
export async function POST() {
    return NextResponse.json({ Name: "Omil" })
}
