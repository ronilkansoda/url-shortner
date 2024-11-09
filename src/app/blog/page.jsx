// 'use client'
import getDomain from "../lib/getDomain";

async function getData() {
    const domain = getDomain();
    console.log(`${domain}/api/post`)
    const endpoint = `${domain}/api/post`
    // const res = await fetch(endpoint, { next: { revalidate: 10 } });
    const res = await fetch(endpoint, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store', // or use revalidate if you want to cache
        // next: { revalidate: 10 } // alternative to cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error("Failed to fetch the data")
    }

    if (res.headers.get("content-type") != "application/json") {
        return { items: [] }
    }

    return res.json();
}

export default async function page() {
    const data = await getData();
    const items = data && data.items ? [...data.items] : [];

    return (
        <div className='flex justify-center '>
            {/* <h1 className='bg-slate-300 text-black p-3 rounded-lg'>Ronil</h1> */}
            {/* <p>and there is data <span>{data.items[0].title ? data.items[0].title : "none"}</span></p> */}

            {items.map((item) => (
                <li key={item.id}>{item.title}</li>
            ))}


        </div>
    )
}
