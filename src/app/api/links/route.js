import { NextResponse } from "next/server";
import isValidURL from "@/app/lib/isValidUrl";
import { addLink } from "@/app/lib/db";
import { getMinLinks } from "@/app/lib/db";


export async function GET(req) {
    try {
        const links = await getMinLinks();
        return NextResponse.json(links, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching links", error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    const contentType = await req.headers.get("content-type");
    if (contentType !== "application/json") {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const data = await req.json();
    const url = data && data.url ? data.url : null;

    if (!url) {
        return NextResponse.json({ message: "URL is required" }, { status: 400 });
    }

    const validURL = await isValidURL(url, ["jref.io", "jref-io.vercel.app"], process.env.NEXT_PUBLIC_VERCEL_URL)
    if (!validURL) {
        console.log(`Invalid URL: ${url}`);  // Log invalid URL
        return NextResponse.json({ message: `${url} is not valid.` }, { status: 400 });
    } else {
        console.log(`Valid URL: ${url}`);  // Log valid URL
        const dbResponse = await addLink(url);
        return NextResponse.json(dbResponse, { status: 201 });

    }
}
