import { getSessionUser } from "@/app/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getSessionUser(); // Check session
        if (user) {
            return NextResponse.json({ user });
        }
        return NextResponse.json({ message: "No active session" }, { status: 401 });
    } catch (error) {
        console.error("Error in /api/session:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
