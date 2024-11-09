import { NextResponse } from "next/server";

// export async function GET() {
//     return NextResponse.json({ items: [{ id: 1, title: "Hello ronil" }] })
// }

export async function GET() {
    try {
        // For testing purposes, return some dummy data
        const dummyData = {
            items: [
                { id: 1, title: "First Post" },
                { id: 2, title: "Second Post" },
                { id: 3, title: "Third Post" }
            ]
        };

        return NextResponse.json(dummyData);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}