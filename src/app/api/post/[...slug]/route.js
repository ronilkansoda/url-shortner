import { NextResponse } from "next/server";

// export async function GET(request, context) {
//     console.log("Request:", request);
//     console.log("Context:", context); // e.g., { params: { slug: 'your-slug' } }

//     return NextResponse.json({ name: "Ronil" });
// }


export async function GET(request, context) {
    const params = await context.params; // Await the params to ensure they are fully resolved
    console.log("Slug:", params.slug); // Now `params` should be available

    // Send JSON response
    return NextResponse.json({ slug: params.slug });
}
