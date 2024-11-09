// // 'use client'
// import getDomain from "../lib/getDomain";

// async function getData() {
//     const domain = getDomain();
//     console.log(`${domain}/api/post`)
//     const endpoint = `${domain}/api/post`
//     const res = await fetch(endpoint, { next: { revalidate: 10 } });
//     // const res = await fetch(endpoint, {
//     //     headers: { 'Content-Type': 'application/json' },
//     //     cache: 'no-store', // or use revalidate if you want to cache
//     //     // next: { revalidate: 10 } // alternative to cache: 'no-store'
//     // });

//     if (!res.ok) {
//         throw new Error("Failed to fetch the data")
//     }

//     if (res.headers.get("content-type") != "application/json") {
//         return { items: [] }
//     }

//     return res.json();
// }

// export default async function page() {
//     const data = await getData();
//     const items = data && data.items ? [...data.items] : [];

//     return (
//         <div className='flex justify-center '>
//             {/* <h1 className='bg-slate-300 text-black p-3 rounded-lg'>Ronil</h1> */}
//             {/* <p>and there is data <span>{data.items[0].title ? data.items[0].title : "none"}</span></p> */}

//             {items.map((item) => (
//                 <li key={item.id}>{item.title}</li>
//             ))}


//         </div>
//     )
// }

import getDomain from "../lib/getDomain";

async function getData() {
    try {
        const domain = getDomain();
        const endpoint = `${domain}/api/post`;

        console.log('Fetching from endpoint:', endpoint);

        const res = await fetch(endpoint, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error('Fetch error:', res.status, res.statusText);
            return { items: [] };
        }

        const data = await res.json();
        console.log('Received data:', data);
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        return { items: [] };
    }
}

export default async function Page() {
    const data = await getData();
    const items = data?.items || [];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-2xl font-bold mb-6 text-center">Blog Posts</h1>

                {items.length === 0 ? (
                    <div className="text-center bg-white p-6 rounded-lg shadow">
                        <p className="text-gray-600">No posts found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                            >
                                <h2 className="text-xl font-semibold">{item.title}</h2>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}